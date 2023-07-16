import { routes } from "../helper/routes";

import {login, signup} from "../controllers/authController"

routes.post("/login", login )
routes.post("/signup", signup )

const authRoute = routes
export default authRoute ;
