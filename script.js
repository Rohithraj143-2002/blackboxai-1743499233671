document.addEventListener('DOMContentLoaded', () => {
    const uploadContainer = document.getElementById('upload-container');
    const fileInput = document.getElementById('image-upload');
    const previewContainer = document.getElementById('preview-container');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Handle drag and drop
    uploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContainer.classList.add('border-blue-500', 'bg-blue-50');
    });

    uploadContainer.addEventListener('dragleave', () => {
        uploadContainer.classList.remove('border-blue-500', 'bg-blue-50');
    });

    uploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('border-blue-500', 'bg-blue-50');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleImageUpload();
        }
    });

    // Handle file selection
    fileInput.addEventListener('change', handleImageUpload);

    function handleImageUpload() {
        const file = fileInput.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPEG, PNG)');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Set canvas dimensions
                const maxWidth = 800;
                const maxHeight = 800;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }

                if (height > maxHeight) {
                    width = (maxHeight / height) * width;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw image with enhanced Ghibli filter
                ctx.drawImage(img, 0, 0, width, height);
                
                // Apply multiple Ghibli-style effects
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;
                
                // Color adjustment for Ghibli style
                for (let i = 0; i < data.length; i += 4) {
                    // Increase warmth (more red/yellow)
                    data[i] = Math.min(255, data[i] * 1.1);     // R
                    data[i+1] = Math.min(255, data[i+1] * 1.05); // G
                    data[i+2] = Math.min(255, data[i+2] * 0.95); // B
                    
                    // Soften contrast slightly
                    const avg = (data[i] + data[i+1] + data[i+2]) / 3;
                    data[i] = avg * 0.3 + data[i] * 0.7;
                    data[i+1] = avg * 0.3 + data[i+1] * 0.7;
                    data[i+2] = avg * 0.3 + data[i+2] * 0.7;
                }
                
                ctx.putImageData(imageData, 0, 0);
                
                // Add hand-painted texture overlay
                const texture = new Image();
                texture.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop';
                texture.onload = function() {
                    ctx.globalAlpha = 0.15;
                    ctx.drawImage(texture, 0, 0, width, height);
                    ctx.globalAlpha = 1.0;
                    canvas.classList.add('ghibli-filter');
                };

                // Show preview and hide upload
                uploadContainer.classList.add('hidden');
                previewContainer.classList.remove('hidden');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Download button
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'ghibli-portrait.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        previewContainer.classList.add('hidden');
        uploadContainer.classList.remove('hidden');
        fileInput.value = '';
    });
});