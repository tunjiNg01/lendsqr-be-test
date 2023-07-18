import chai from "chai";
import chaiHttp from "chai-http";
var expect = chai.expect
var should = chai.should

chai.use(chaiHttp)
const API_PATH = "http://127.0.0.1:3200/api/v1"



describe("USER",  () => {

    describe("POST/ signup",  () => {
    
    //   PLEASE NOTE: Email is expected to be unique to have a successful test
      let data =   { email: 'James.Takowski@gmail.com', 
                     password: 'password1234',
                     firstname: 'James',
                     lastname: 'Takowski',
                     address: '125 Agege community stadium',
                     country: 'Nigeria',
                    }
        it("Signup: should return status 200 if successful", (done) => {
            chai.request(API_PATH).post("/auth/signup")
            .send(data).end((err, res:any) => {
                expect(res.status).to.equal(200)
                done()
                
            })
        })
    });

    describe("POST/ login",  () => {
        
        it("Login: should return user token and validate token if successful", (done) => {
            chai.request(API_PATH).post("/auth/login")
            .send({ email: 'Tyree.Spencer@gmail.com', password: 'password1234' }).end((err, res:any) => {
               
               console.log(res._body.token);
               
                expect(res.status).to.equal(200)
                expect(res.token).to.not.be.null;
                done()
                
            })
        })
    });


   
})