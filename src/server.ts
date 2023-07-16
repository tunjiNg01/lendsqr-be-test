import dotenv from "dotenv"
import app from "./app"
dotenv.config()


if (process.env.NODE_ENV == "production") {
    console.log("production");
    
}

const port = process.env.PORT 

app.listen(port, () => {
    console.log(`now listening on port! ${port}`);
})