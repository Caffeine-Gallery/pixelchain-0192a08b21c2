import { backend } from 'declarations/backend';
import { Principal } from '@dfinity/principal';
import { IDL } from '@dfinity/candid';

document.addEventListener('DOMContentLoaded', async () => {
    const uploadButton = document.getElementById('upload-button');
    const imageInput = document.getElementById('image-input');
    const imageGallery = document.getElementById('image-gallery');

    uploadButton.addEventListener('click', async () => {
        const file = imageInput.files[0];
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                const blob = IDL.Vec(IDL.Nat8).encode(uint8Array);
                
                const result = await backend.uploadImage(blob, file.type);
                if (result.ok) {
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
