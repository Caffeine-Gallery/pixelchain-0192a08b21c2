import Bool "mo:base/Bool";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import List "mo:base/List";

import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Error "mo:base/Error";
import Float "mo:base/Float";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
    // Define the Image type
    public type Image = {
        id: Text;
        owner: Principal;
        createdAt: Time.Time;
        url: Text;
        contentType: Text;
    };

    // Store images
    private stable var imagesEntries : [(Text, Image)] = [];
    private var images = HashMap.HashMap<Text, Image>(10, Text.equal, Text.hash);

    // Initialize images from stable storage
    private func loadImages() : () {
        for ((k, v) in imagesEntries.vals()) {
            images.put(k, v);
        };
    };

    // Save images to stable storage before upgrades
    system func preupgrade() {
        imagesEntries := Iter.toArray(images.entries());
    };

    // Clear temporary storage after upgrade
    system func postupgrade() {
        imagesEntries := [];
    };

    // Call loadImages when deploying
    loadImages();

    // Upload an image
    public shared(msg) func uploadImage(imageBlob: Blob, contentType: Text) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        let id = generateUniqueId();
        let createdAt = Time.now();
        let url = generateImageUrl(id);

        if (not isValidImageType(contentType)) {
            return #err("Invalid image type. Supported types are image/jpeg, image/png, and image/gif");
        };

        let newImage : Image = {
            id = id;
            owner = caller;
            createdAt = createdAt;
            url = url;
            contentType = contentType;
        };

        images.put(id, newImage);
        #ok(id)
    };

    // Generate a unique ID for the image
    private func generateUniqueId() : Text {
        let timestamp = Int.abs(Time.now());
        let timestampText = Int.toText(timestamp);
        let randomPart = Nat32.toNat(Text.hash(timestampText));
        return timestampText # "-" # Nat.toText(randomPart);
    };

    // Generate a unique URL for the image
    private func generateImageUrl(id: Text) : Text {
        return "https://" # Principal.toText(Principal.fromText(id)) # ".raw.ic0.app/image/" # id;
    };

    // Check if the content type is a valid image type
    private func isValidImageType(contentType: Text) : Bool {
        let validTypes = ["image/jpeg", "image/png", "image/gif"];
        Array.find<Text>(validTypes, func (t) { t == contentType }) != null
    };

    // Retrieve an image by ID
    public query func getImage(id: Text) : async ?Image {
        return images.get(id);
    };

    // List all images
    public query func listImages() : async [Image] {
        return Iter.toArray(images.vals());
    };

    // Get the size of the images collection
    public query func getImagesCount() : async Nat {
        return images.size();
    };
}
