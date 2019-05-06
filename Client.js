import FormData from 'form-data';
import axios from "axios";

export default function postImage(img, onSuccess) {
    const URL = "http://192.168.0.56:5000/landmarks"
    
    let data = new FormData();
    data.append('image', img.base64, "image.jpg");
    
    axios.post(URL, data, {
        headers: {
            'Content-Type': `application/json`,
        }
    })
    .then((response) => {
        // console.log(JSON.stringify(response));
        onSuccess(response.data)
    }).catch((error) => {
        onSuccess("error");
        console.log("error");
    });
}