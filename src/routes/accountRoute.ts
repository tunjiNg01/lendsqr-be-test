import { routes } from "../helper/routes";
import {fundAccount, withdrawFunds, transferFunds} from "../controllers/accountController";
import { tokenValidator } from "../controllers/authController";

// this middleware is used to protect the routes 
// and its also introduce the user auth user data to the request object body 
routes.use(tokenValidator)
routes.post("/fund-account", fundAccount)
routes.post("/withdraw-funds", withdrawFunds)
routes.post("/transfer-funds", transferFunds)

export default routes