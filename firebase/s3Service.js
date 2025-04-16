// firebase/s3Service.js
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, s3BucketName } from './s3Config';

export const uploadFileToS3 = async (file, userId) => {
  try {
    // Generate a unique file name
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_images/${userId}/${Date.now()}.${fileExtension}`;
    
    // Get file content as array buffer
    const fileContent = await file.arrayBuffer();
    
    // Set up the parameters for S3 upload
    const params = {
      Bucket: s3BucketName,
      Key: fileName,
      Body: Buffer.from(fileContent),
      ContentType: file.type,
    //   ACL: 'public-read',
    };
    
    // Upload to S3
    await s3Client.send(new PutObjectCommand(params));
    
    // Return the public URL
    return `https://${s3BucketName}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};