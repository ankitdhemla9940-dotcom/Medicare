var express = require("express");

var app = express();

app.use(express.static("publicpro"));
app.use(express.urlencoded({ extended: true }));

// app.listen(3000, function () {

//     console.log("Server Started");
// })

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", function () {
    console.log("Server Started on port " + PORT);
});

app.get("/", function (req, resp) {

    var path = __dirname + "/publicpro/index.html";
    resp.sendFile(path);
})



var mysql = require("mysql2");


require("dotenv").config();
console.log("Gemini key exists:", !!process.env.GEMINI_API_KEY);


let url = process.env.AIVEN_URL;

let mycon = mysql.createConnection(url);

mycon.connect(function (err) {
    if (err == null)
        console.log("Database Connected");
    else
        console.log(err.message);

})
app.get("/signup-process", function (req, resp) {

    let emailid = req.query.emailid;
    let pwd = req.query.pwd;
    let utype = req.query.utype;

    mycon.query("insert into userspro values(?,?,?,current_date(),1)", [emailid, pwd, utype], function (err, result) {
        if (err == null)
            resp.send("User Registered Successfully");
        else
            resp.send(err.message);
    })
})
app.get("/check-email", function (req, resp) {

    let emailid = req.query.emailid;

    mycon.query("select * from userspro where emailid=?", [emailid], function (err, result) {
        if (err == null) {
            if (result.length == 1)
                resp.send("Already Registered");
            else
                resp.send("Available");
        }
        else
            resp.send(err.message);
    })
})

app.use(express.urlencoded(true));
app.get("/login-process", function (req, resp) {

    let emailid = req.query.emailid;
    let pwd = req.query.pwd;

    mycon.query("select * from userspro where emailid=? and pwd=?", [emailid, pwd], function (err, result) {
        if (err == null) {
            if (result.length == 0)
                resp.send("Invalid Credentials");
            else if (result[0].activee == 1)
                resp.send(result[0].utype);
            else
                resp.send("Account is Inactive");
        }
        else
            resp.send(err.message);

    })
})
app.get("/fetch-user", function (req, resp) {

    let emailid = req.query.emailid;

    mycon.query("select * from dprofiles where emailid=?", [emailid], function (err, resultJSONAry) {

        if (err == null) {
            resp.send(resultJSONAry);
        }
        else
            resp.send(err.message);

    })

})
var fileuploader = require("express-fileupload");
app.use(fileuploader());

var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET // Click 'View API Keys' above to copy your API secret
});

app.get("/profile", function (req, resp) {

    var path = __dirname + "/publicpro/donor-profile.html";
    resp.sendFile(path);
})
app.get("/n-profile", function (req, resp) {

    var path = __dirname + "/publicpro/Needy-Profile.html";
    resp.sendFile(path);
})
app.get("/dash-donor", function (req, resp) {

    var path = __dirname + "/publicpro/dash-donor.html";
    resp.sendFile(path);
})
app.get("/avail", function (req, resp) {

    var path = __dirname + "/publicpro/availmed.html";
    resp.sendFile(path);
})
app.get("/register-ngo", function (req, resp) {

    var path = __dirname + "/publicpro/NGO-Registration.html";
    resp.sendFile(path);
})
app.get("/avail-equip", function (req, resp) {

    var path = __dirname + "/publicpro/availequip.html";
    resp.sendFile(path);
})
app.get("/search-ngo", function (req, resp) {

    var path = __dirname + "/publicpro/NGO-Finder.html";
    resp.sendFile(path);
})

app.post("/save-profile", async function (req, resp) {

    let msgA = "File not Uploaded";
    let myAUrl = "nopic.jpg";
    if (req.files != null) {
        let fileNameA = req.files.Aadharcard.name;
        let fullPathA = __dirname + "/uploads/" + fileNameA;
        await req.files.Aadharcard.mv(fullPathA);
        msgA = "Uploaded Successfully";

        await cloudinary.uploader.upload(fullPathA).then(function (picUrlResult) {
            myAUrl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myAUrl);
        });
    }

    msgP = "File not Uploaded";
    let myPUrl = "nopic.jpg";
    if (req.files != null) {
        let fileNameP = req.files.ProfilePic.name;
        let fullPathP = __dirname + "/uploads/" + fileNameP;
        await req.files.ProfilePic.mv(fullPathP);
        msgP = "Uploaded Successfully";

        await cloudinary.uploader.upload(fullPathP).then(function (picUrlResult) {
            myPUrl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myPUrl);
        });
    }
    let emailid = req.body.txtemail;
    let name = req.body.txtname;
    let mobile = req.body.txtmob;
    let state = req.body.state;
    let city = req.body.city;
    let address = req.body.txtAdd;
    let pincode = req.body.pincode;

    mycon.query("insert into dprofiles values(?,?,?,?,?,?,?,?,?)", [emailid, name, mobile, address, state, city, pincode, myAUrl, myPUrl], function (err) {
        if (err == null)
            resp.send("Donor Profile Saved Successsfulllyyyy");
        else
            resp.send(err.message);
    })
})
app.post("/modify-profile", async function (req, resp) {

    let msgA = "File not Uploaded";
    let myAUrl = "nopic.jpg";
    if (req.files != null) {
        let fileNameA = req.files.Aadharcard.name;
        let fullPathA = __dirname + "/uploads/" + fileNameA;
        await req.files.Aadharcard.mv(fullPathA);
        msgA = "Uploaded Successfully";

        await cloudinary.uploader.upload(fullPathA).then(function (picUrlResult) {
            myAUrl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myAUrl);
        });
    }

    msgP = "File not Uploaded";
    let myPUrl = "nopic.jpg";
    if (req.files != null) {
        let fileNameP = req.files.ProfilePic.name;
        let fullPathP = __dirname + "/uploads/" + fileNameP;
        await req.files.ProfilePic.mv(fullPathP);
        msgP = "Uploaded Successfully";

        await cloudinary.uploader.upload(fullPathP).then(function (picUrlResult) {
            myPUrl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myPUrl);
        });
    }
    let emailid = req.body.txtemail;
    let name = req.body.txtname;
    let mobile = req.body.txtmob;
    let state = req.body.state;
    let city = req.body.city;
    let address = req.body.txtAdd;
    let pincode = req.body.pincode;

    if (myAUrl == "nopic.jpg" && myPUrl == "nopic.jpg") {
        mycon.query("update dprofiles set name=?,mobile=?,address=?,state=?,city=?,pincode=? where emailid=?", [name, mobile, address, state, city, pincode, emailid], function (err) {

            if (err == null)
                resp.send("Data Updated Successfully");
            else
                resp.send(err.message);
        })
    }
    else if (myAUrl == "nopic.jpg") {
        mycon.query("update dprofiles set name=?,mobile=?,address=?,state=?,city=?,pincode=?, picpath=? where emailid=?", [name, mobile, address, state, city, pincode, myPUrl, emailid], function (err) {

            if (err == null)
                resp.send("Data Updated Successfully");
            else
                resp.send(err.message);
        })
    }
    else if (myPUrl == "nopic.jpg") {
        mycon.query("update dprofiles set name=?,mobile=?,address=?,state=?,city=?,pincode=?,acardpath=? where emailid=?", [name, mobile, address, state, city, pincode, myAUrl, emailid], function (err) {

            if (err == null)
                resp.send("Data Updated Successfully");
            else
                resp.send(err.message);
        })
    }
    else {
        mycon.query("update dprofiles set name=?,mobile=?,address=?,state=?,city=?,pincode=?,acardpath=?,picpath=? where emailid=?", [name, mobile, address, state, city, pincode, myAUrl, myPUrl, emailid], function (err) {

            if (err == null)
                resp.send("Data Updated Successfully");
            else
                resp.send(err.message);
        })
    }

})
app.post("/avail-med", async function (req, resp) {

    let msg = "File not Uploaded";
    let myUrl = "nopic.jpg";
    if (req.files != null) {
        let fileName = req.files.Medimage.name;
        let fullPath = __dirname + "/uploads/" + fileName;
        await req.files.Medimage.mv(fullPath);
        msg = "Uploaded Successfully";

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            myUrl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myUrl);
        });
    }

    let emailid = req.body.txtemail;
    let medname = req.body.medname;
    let expdate = req.body.txtexp;
    let company = req.body.company;
    let packing = req.body.packing;
    let qty = req.body.qty;
    let info = req.body.oinfo;

    mycon.query("insert into medicines values(null,?,?,?,?,?,?,?,?)", [emailid, medname, expdate, company, packing, qty, info, myUrl], function (err) {
        if (err == null)
            resp.send("Medicine Availed Successsfulllyyyy");
        else
            resp.send(err.message);
    })
})
app.post("/avail-med-equip", async function (req, resp) {

    let msg1 = "File not Uploaded";
    let myUrl1 = "nopic.jpg";
    if (req.files != null) {
        let fileName1 = req.files.equipimage1.name;
        let fullPath1 = __dirname + "/uploads/" + fileName1;
        await req.files.equipimage1.mv(fullPath1);
        msg1 = "Uploaded Successfully";

        await cloudinary.uploader.upload(fullPath1).then(function (picUrlResult) {
            myUrl1 = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myUrl1);
        });
    }
    let msg2 = "File not Uploaded";
    let myUrl2 = "nopic.jpg";
    if (req.files != null) {
        let fileName2 = req.files.equipimage2.name;
        let fullPath2 = __dirname + "/uploads/" + fileName2;
        await req.files.equipimage2.mv(fullPath2);
        msg2 = "Uploaded Successfully";

        await cloudinary.uploader.upload(fullPath2).then(function (picUrlResult) {
            myUrl2 = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myUrl2);
        });
    }

    let emailid = req.body.txtemail;
    let equipment = req.body.equipname;
    let conditioon = req.body.Condition;
    let dtype = req.body.type;
    let amount = req.body.Amount;
    let info = req.body.oinfo;

    mycon.query("insert into equipments values(null,?,?,?,?,?,?,?,?)", [emailid, equipment, conditioon, dtype, amount, myUrl1, myUrl2, info], function (err) {
        if (err == null)
            resp.send("Medical Equipment Availed Successsfulllyyyy");
        else
            resp.send(err.message);
    })
})
//------------------Angular------------------------------

app.get("/fetch-users", function (req, resp) {

    var path = __dirname + "/publicpro/admin-users-dash.html";
    resp.sendFile(path);
})
app.get("/dash-admin", function (req, resp) {

    var path = __dirname + "/publicpro/dash-admin.html";
    resp.sendFile(path);
})
app.get("/dash-ngo", function (req, resp) {

    var path = __dirname + "/publicpro/dash-ngo.html";
    resp.sendFile(path);
})
app.get("/dash-needy", function (req, resp) {

    var path = __dirname + "/publicpro/dash-needy.html";
    resp.sendFile(path);
})
app.get("/show-med", function (req, resp) {

    var path = __dirname + "/publicpro/admin-allmedicines.html";
    resp.sendFile(path);
})

app.get("/fetch-all", function (req, resp) {


    mycon.query("select * from userspro order by utype", function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})

app.get("/do-block", function (req, resp) {

    let emailid = req.query.emailkey;

    mycon.query("update userspro set activee=0 where emailid=?", [emailid], function (err, result) {

        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("User Blocked Successfully");
            else
                resp.send("Record Not Found");
        }
        else
            resp.send(err.message);

    })

})
app.get("/do-resume", function (req, resp) {

    let emailid = req.query.emailkey;

    mycon.query("update userspro set activee=1 where emailid=?", [emailid], function (err, result) {

        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("User Un-Blocked Successfully");
            else
                resp.send("Record Not Found");
        }
        else
            resp.send(err.message);

    })

})

app.get("/fetch-dprofiles", function (req, resp) {

    var path = __dirname + "/publicpro/admin-donors-dash.html";
    resp.sendFile(path);
})

app.get("/show-profiles", function (req, resp) {


    mycon.query("select * from dprofiles order by emailid", function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})

app.get("/do-delete", function (req, resp) {

    let email = req.query.emailkeykuch;

    mycon.query("delete from dprofiles where emailid=?", [email], function (err, result) {

        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("Record Deleted Successfully");
            else
                resp.send("Record Not Found");
        }
        else
            resp.send(err.message);

    })

})

app.get("/show-recordmed", function (req, resp) {

    let email = req.query.emailkey;


    mycon.query("select * from medicines where emailid=?", [email], function (err, resultable) {

        if (err == null) {

            if (resultable.length > 0)
                resp.json(resultable);
            else
                resp.send("[]");
        }
        else
            resp.send(err.message);

    })

})
app.get("/show-recordequip", function (req, resp) {

    let email = req.query.emailkey;


    mycon.query("select * from equipments where emailid=?", [email], function (err, resultable) {

        if (err == null) {

            if (resultable.length > 0)
                resp.json(resultable);
            else
                resp.send("[]");
        }
        else
            resp.send(err.message);

    })

})

app.get("/do-unlistmed", function (req, resp) {

    let email = req.query.emailkey;
    let med = req.query.medkey;

    mycon.query("delete from medicines where emailid=? and medname=?", [email, med], function (err, result) {

        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("Record Deleted Successfully");
            else
                resp.send("Record Not Found");
        }
        else
            resp.send(err.message);

    })

})
app.get("/do-unlistequip", function (req, resp) {

    let email = req.query.emailkey;
    let equipment = req.query.equipkey;

    mycon.query("delete from equipments where emailid=? and equipment=?", [email, equipment], function (err, result) {

        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("Record Deleted Successfully");
            else
                resp.send("Record Not Found");
        }
        else
            resp.send(err.message);

    })

})
app.get("/do-update", function (req, resp) {

    let email = req.query.emailkey;
    let expwd = req.query.expwdkey;
    let newpwd = req.query.newpwdkey;

    mycon.query("update userspro set pwd=? where emailid=? and pwd=?", [newpwd, email, expwd], function (err, result) {

        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("Password Updated Successfully");
            else
                resp.send("Record Not Found");
        }
        else
            resp.send(err.message);

    })

})

app.get("/show-medicine", function (req, resp) {

    let med = req.query.medkey;


    mycon.query("select * from medicines where medname=?", [med], function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})
app.get("/show-allmed", function (req, resp) {


    mycon.query("select * from medicines ", function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})

app.get("/search-med", function (req, resp) {

    var path = __dirname + "/publicpro/medFinder.html";
    resp.sendFile(path);
})
app.get("/search-equip", function (req, resp) {

    var path = __dirname + "/publicpro/equipfinder.html";
    resp.sendFile(path);
})

app.get("/fill-cities", function (req, resp) {


    mycon.query("select distinct city from dprofiles", function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})
app.get("/fill-citiesngo", function (req, resp) {


    mycon.query("select distinct city from ngos", function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})

app.get("/city-med", function (req, resp) {

    let city = req.query.citykey


    mycon.query("select distinct medname from medicines inner join dprofiles on medicines.emailid=dprofiles.emailid where city=?", [city], function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})

app.get("/med-overview", function (req, resp) {

    let city = req.query.citykey;
    let med = req.query.medkey;


    mycon.query("select * from medicines inner join dprofiles on medicines.emailid=dprofiles.emailid where city=? and medname=?", [city, med], function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})

app.get("/city-equip", function (req, resp) {

    let city = req.query.citykey


    mycon.query("select distinct equipment from equipments inner join dprofiles on equipments.emailid=dprofiles.emailid where city=?", [city], function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})

app.get("/equip-overview", function (req, resp) {

    let city = req.query.citykey;
    let equip = req.query.equipkey;


    mycon.query("select * from equipments inner join dprofiles on equipments.emailid=dprofiles.emailid where city=? and equipment=?", [city, equip], function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})

app.get("/show-detail", function (req, resp) {

    let email = req.query.emailkey;
    let med = req.query.medkey;


    mycon.query("select * from medicines where emailid=? and medname=?", [email, med], function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})

app.get("/show-detailequip", function (req, resp) {

    let email = req.query.emailkey;
    let equip = req.query.equipkey;


    mycon.query("select * from equipments where emailid=? and equipment=?", [email, equip], function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})

//============================================

app.post("/reg-ngo", async function (req, resp) {

    let msg = "File not Uploaded";
    let myUrl = "nopic.jpg";
    if (req.files != null) {
        let fileName = req.files.proofimage.name;
        let fullPath = __dirname + "/uploads/" + fileName;
        await req.files.proofimage.mv(fullPath);
        msgA = "Uploaded Successfully";

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            myUrl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myUrl);
        });
    }

    let emailid = req.body.txtemail;
    let ngo = req.body.txtname;
    let regoffice = req.body.regadd;
    let city = req.body.city;
    let web = req.body.txtlink;
    let contact = req.body.txtnum;
    let since = req.body.txtsin;
    let cperson = req.body.cperson;
    let work = req.body.nprofilew;
    let regnum = req.body.regnum;


    mycon.query("insert into ngos values(?,?,?,?,?,?,?,?,?,?,?)", [emailid, ngo, regoffice, city, web, contact, since, cperson, work, regnum, myUrl], function (err) {
        if (err == null)
            resp.send("Registration is Successfully Completed");
        else
            resp.send(err.message);
    })
})

app.get("/NGO-details", function (req, resp) {

    let city = req.query.citykey;


    mycon.query("select * from ngos where city=?", [city], function (err, resultable) {

        if (err == null) {
            resp.send(resultable);
        }
        else
            resp.send(err.message);

    })

})

//==============================================


// Gemini AI via direct REST API (avoids SDK v1beta auth issues with AQ. keys)
async function RajeshBansalKaChirag(imgurl) {

    const myprompt = `Extract the following details from the Aadhaar card.
Return ONLY valid JSON in this exact format:
{
  "adhaar_number":"",
  "name":"",
  "gender":"",
  "dob":""
}
Do not return markdown, no extra text.`;

    // Download the Aadhaar image from Cloudinary
    const imageResp = await fetch(imgurl);
    const imageBuffer = await imageResp.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    // Call Gemini REST API directly
    // AQ. keys must use x-goog-api-key header (not ?key= query param)
    const geminiResp = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image
                            }
                        },
                        { text: myprompt }
                    ]
                }]
            })
        }
    );

    const geminiData = await geminiResp.json();
    console.log("Gemini raw response:", JSON.stringify(geminiData));

    if (!geminiResp.ok) {
        throw new Error("Gemini API error: " + JSON.stringify(geminiData));
    }

    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Gemini extracted text:", text);

    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
}

app.post("/n-profile", async function (req, resp) {

    try {
        if (req.files == null || !req.files.Aadharcard) {
            return resp.send("Please upload your Aadhar card image.");
        }

        // 1. Upload Aadhar image to local disk
        let fileName = req.files.Aadharcard.name;
        let fullPath = __dirname + "/uploads/" + fileName;
        await req.files.Aadharcard.mv(fullPath);

        // 2. Upload to Cloudinary
        let picUrlResult = await cloudinary.uploader.upload(fullPath);
        let myUrl = picUrlResult.url;
        console.log("Cloudinary URL:", myUrl);

        // 3. Extract Aadhaar details via Gemini AI
        let jsonResultFromAi = await RajeshBansalKaChirag(myUrl);
        if (jsonResultFromAi == null) {
            return resp.send("Unable to extract Aadhaar details from image. Please upload a clear Aadhar card photo.");
        }
        console.log("Gemini AI Result:", jsonResultFromAi);

        let name  = jsonResultFromAi.name;
        let adhno = jsonResultFromAi.adhaar_number;
        let gen   = jsonResultFromAi.gender;
        let dob   = jsonResultFromAi.dob;

        // Convert DD/MM/YYYY → YYYY/MM/DD for MySQL DATE field
        const formatted = dob ? dob.split("/").reverse().join("/") : null;

        let email = req.body.txtemail;
        let mob   = req.body.txtmob;
        let addr  = req.body.txtAdd;
        let state = req.body.state;
        let city  = req.body.city;
        let pin   = req.body.pincode;

        // 4. Save to database
        mycon.query(
            "insert into needys values(?,?,?,?,?,?,?,?,?,?,?)",
            [email, mob, myUrl, name, adhno, addr, state, city, pin, gen, formatted],
            function (err) {
                if (err == null)
                    resp.send("Needy Profile Saved Successsfulllyyyy");
                else
                    resp.send(err.message);
            }
        );

    } catch (err) {
        console.error("Error in /n-profile:", err);
        resp.send("Error: " + err.message);
    }

})