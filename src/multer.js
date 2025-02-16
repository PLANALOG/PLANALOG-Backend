import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}) // s3 객체 생성
// access key는 S3에 접근하기 위한 IAM 사용자의 고유한 ID와 비밀번호 

/*
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})
    */

export const upload = multer({ // 
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const uploadDirctory = "profile_images/";

            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'); //한글파일명 깨짐 방지
            const ext = path.extname(file.originalname);

            cb(null, uploadDirctory + path.basename(file.originalname, ext) + Date.now() + ext);
        }
    })

})

/*
export const uploadMomentImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const uploadDirectory = "moment_images/";

            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'); // 한글 파일명 깨짐 방지
            const ext = path.extname(file.originalname);

            cb(null, uploadDirectory + path.basename(file.originalname, ext) + Date.now() + ext);
        }
    })
}).array("images"); // 📌 Moment는 여러 장 업로드 가능 (제한 없음)
*/


//s3 파일 삭제
export const deleteFile = async (fileUrl) => {
    fileUrl = decodeURIComponent(fileUrl.split('com/')[1]);
    //url 인코딩된 경로를 디코딩 -> 한글이나 특수문자포함된 파일 삭제 가능


    console.log(fileUrl);

    let params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileUrl
    }
    try {
        s3.deleteObject(params, (error, data) => {
            if (error) {
                console.log(error);
            } else {
                console.log('파일 삭제 성공 :', data);

            }
        })
    } catch (error) {
        console.log(error);
        throw new Error('파일 삭제 실패');
    }
}
