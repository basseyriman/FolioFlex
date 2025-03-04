export const validatePhoto = (file) => {
  const validations = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    minDimensions: { width: 400, height: 400 },
  };

  return new Promise((resolve, reject) => {
    if (!validations.allowedTypes.includes(file.type)) {
      reject("Invalid file type");
    }

    if (file.size > validations.maxSize) {
      reject("File too large");
    }

    const img = new Image();
    img.onload = () => {
      if (
        img.width < validations.minDimensions.width ||
        img.height < validations.minDimensions.height
      ) {
        reject("Image dimensions too small");
      }
      resolve(true);
    };
    img.src = URL.createObjectURL(file);
  });
};
