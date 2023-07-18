import chai from "chai";
import chaiHttp from "chai-http";
var expect = chai.expect
var should = chai.should

chai.use(chaiHttp)
const API_PATH = "http://127.0.0.1:3200/api/v1"

// PLEASE NOTE: This token expire in one hour to run a successful test you need to update the token
// check the terminal to obtain the new token right after  [POST/ login]
const AccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTY4OTY2OTMxNCwiZXhwIjoxNjg5NjcyOTE0fQ.faCaDhvJGxA0CyMiuvRwK0fo650U-IVA03B18INxRXk"



describe("USER",  () => {

    describe("POST/ fund account",  () => {
      let data =   {  
                      amount: 30000
                    }
        it("Fund account: should return status 200 if successful", (done) => {
            chai.request(API_PATH).post("/account/fund-account")
            .auth(AccessToken, { type: 'bearer' })  
            .send(data)
            .end((err, res:any) => {
                expect(res.status).to.equal(200)
                done()
                
            })
        })
    });

    describe("POST/ fund withdrawal",  () => {
        
        it("Withdrawal: should return status 200 if successful", (done) => {
            let data =   {  
                amount: 1700
              }
            chai.request(API_PATH).post("/account/withdraw-funds")
            .auth(AccessToken, { type: 'bearer' })
            .send(data).end((err, res:any) => {
               
                expect(res.status).to.equal(200)
                done()
                
            })
        })
    });

    describe("POST/ Transfer fund",  () => {
        
        it("Transfer: should return status 200 if successful", (done) => {
            let data =   {  
                amount: 1700,
                designatedAccountId: 11
              }
            chai.request(API_PATH).post("/account/withdraw-funds")
            .auth(AccessToken, { type: 'bearer' })
            .send(data).end((err, res:any) => {
               
                expect(res.status).to.equal(200)
                done()
                
            })
        })
    });


   
})