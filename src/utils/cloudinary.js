import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

//configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// File Upload
const uploadOnCloudnary = async (localFilePath) => {

    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader
            .upload(localFilePath, {
                resource_type: "auto"
            }
            )
            .catch((error) => {
                console.log(error);
            });
        // console.log("File is uploaded in cloudinary");
        // console.log(response.url);
        console.log("\n******** cloudnary response ********\n");
        console.log(response);
        console.log("\n************************************\n");
        
        


        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temp file as the upload falid.
        return null
    }
}

export { uploadOnCloudnary }
