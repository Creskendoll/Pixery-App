import FormData from 'form-data';
import axios from "axios";

export default function postImage(img) {
    const URL = "http://10.67.185.63:5000/landmarks"
    
    let data = new FormData();
    data.append('image', img.base64, "image.jpg");
    
    axios.post(URL, data, {
        headers: {
            'Content-Type': `application/json`,
        }
    })
    .then((response) => {
        console.log(JSON.stringify(response));
    }).catch((error) => {
        console.log("error");
    });
}