/**
 * Optimizes Cloudinary image URLs by injecting transformation parameters
 * @param {string} url - The original Cloudinary image URL
 * @param {number} width - Desired width in pixels
 * @param {number} height - Desired height in pixels
 * @returns {string} - Optimized image URL with transformations
 */
export const getOptimizedImageUrl = (url, width, height) => {
    if (!url) return url;

    // Check if it's a Cloudinary URL
    if (!url.includes('cloudinary.com')) {
        return url;
    }

    // Cloudinary transformation parameters:
    // w_<width> - resize width
    // h_<height> - resize height
    // c_fill - crop mode (fill the dimensions)
    // f_auto - automatic format selection (WebP, AVIF, etc.)
    // q_auto - automatic quality optimization
    const transformations = `w_${width},h_${height},c_fill,f_auto,q_auto`;

    // Insert transformations after '/upload/' in the URL
    const optimizedUrl = url.replace(
        /\/upload\//,
        `/upload/${transformations}/`
    );

    return optimizedUrl;
};
