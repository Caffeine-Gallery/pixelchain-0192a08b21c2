import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from '@dfinity/principal';

document.addEventListener('DOMContentLoaded', async () => {
    const canisterId = process.env.CANISTER_ID_BACKEND;
    const agent = new HttpAgent();
    const backend = Actor.createActor(canisterId, { agent });

    const uploadButton = document.getElementById('upload-button');
    const imageInput = document.getElementById('image-input');
    const imageGallery = document.getElementById('image-gallery');

    uploadButton.addEventListener('click', async () => {
        const file = imageInput.files[0];
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const blob = new Uint8Array(arrayBuffer);
                
                const result = await backend.uploadImage(blob, file.type);
                if ('ok' in result) {
                    alert(`Image uploaded successfully! ID: ${result.ok}`);
                    await loadImages();
                } else {
                    alert(`Error uploading image: ${result.err}`);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Error uploading image. Please try again.');
            }
        } else {
            alert('Please select an image to upload.');
        }
    });

    async function loadImages() {
        try {
            const images = await backend.listImages();
            imageGallery.innerHTML = '';
            images.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.url;
                imgElement.alt = `Image ${image.id}`;
                imgElement.title = `Created at: ${new Date(Number(image.createdAt) / 1000000).toLocaleString()}`;
                
                const linkElement = document.createElement('a');
                linkElement.href = image.url;
                linkElement.target = '_blank';
                linkElement.appendChild(imgElement);

                const infoElement = document.createElement('p');
                infoElement.textContent = `Owner: ${Principal.fromText(image.owner).toText()}`;

                const containerElement = document.createElement('div');
                containerElement.classList.add('image-container');
                containerElement.appendChild(linkElement);
                containerElement.appendChild(infoElement);

                imageGallery.appendChild(containerElement);
            });
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }

    // Load images when the page loads
    await loadImages();
});
