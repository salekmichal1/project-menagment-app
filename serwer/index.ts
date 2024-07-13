import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import cors from "cors";
import cron from "node-cron";

const app = express();
const port = 3000;

//////////////////////
// connect to firebase

const admin = require("firebase-admin");
const serviceAccount = require("./managme-database-firebase-adminsdk-j9dgs-3792624515.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

//////////////////////

const tokenSecret = process.env.TOKEN_SECRET as string;

app.use(cors());
app.use(express.json());
const bcrypt = require("bcrypt");

// app.post("/token", function (req, res) {
//   const expTime = req.body.exp || 60;
//   const token = generateToken(+expTime);
//   refreshToken = generateToken(60 * 60);
//   res.status(200).send({ token, refreshToken });
// });

app.post("/refreshToken", function (req, res) {
  const refreshTokenFromPost: string = req.body.refreshToken;

  const refreshTokenRef = db.collection("RefreshTokens");

  async function fetchData() {
    try {
      const refreshTokenQuery = await refreshTokenRef
        .where("refreshToken", "==", refreshTokenFromPost)
        .get()
        .then((docSnapShot: any) => {
          if (docSnapShot.empty) {
            res.status(403).send({ message: "Token not found" });
            return;
          }
          let tokenFound: boolean = false;
          for (const doc of docSnapShot.docs) {
            if (doc.data().refreshToken === refreshTokenFromPost) {
              tokenFound = true;
              const expTime = req.headers.exp || 60;
              jwt.verify(
                refreshTokenFromPost,
                tokenSecret,
                (err, user: any) => {
                  if (err) {
                    return res
                      .status(403)
                      .send({ message: "Invalid refresh token" });
                  } else {
                    const token = generateToken(+expTime, user.user);
                    const refreshToken = generateToken(60 * 60, user.user);
                    db.collection("RefreshTokens").add({
                      refreshToken: refreshToken,
                      date: new Date(),
                    });
                    res
                      .status(200)
                      .send({ token, refreshToken, user: user.user });
                  }
                }
              );
              break;
            }
          }

          if (!tokenFound) {
            res.status(400).send("Bad refresh token!");
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  fetchData();
});

// app.post('/refresh-token', (req, res) => {
//   const refreshToken = req.body.refreshToken;

//   if (!refreshToken) {
//     return res.status(403).send({ message: 'No refresh token provided' });
//   }

//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).send({ message: 'Invalid refresh token' });
//     }

//     // Fetch the user data from the database
//     db.collection('Users').doc(user.id).get()
//       .then((doc) => {
//         if (!doc.exists) {
//           return res.status(404).send({ message: 'User not found' });
//         }

//         const userData = doc.data();
//         delete userData.password; // Don't send the password back to the client

//         const newAccessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
//         res.status(200).send({ accessToken: newAccessToken, user: userData });
//       })
//       .catch((error) => {
//         console.error('Error fetching user data:', error);
//         res.status(500).send({ message: 'Error fetching user data' });
//       });
//   });
// });

app.get("/protected/:id/:delay?", verifyToken, (req, res) => {
  const id = req.params.id;
  const delay = req.params.delay ? +req.params.delay : 1000;
  setTimeout(() => {
    res.status(200).send(`{"message": "protected endpoint ${id}"}`);
  }, delay);
});

const hash = function () {
  const saltRounds = 10;

  bcrypt.hash("test", saltRounds, (err: any, hash: any) => {
    if (err) {
      // Handle error
      return;
    }

    // Hashing successful, 'hash' contains the hashed password
    console.log("Hashed password:", hash);
  });
};

// hash();

// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   db.collection("Users")
//     .get()
//     .then((snapshot: any) => {
//       let userFound: boolean = false;
//       snapshot.forEach((doc: any) => {
//         if (
//           doc.data().username === username &&
//           doc.data().password === password
//         ) {
//           userFound = true;
//           const user = doc.data();
//           user.id = doc.id;
//           delete user.password;
//           const token = generateToken(60, user);
//           const refreshToken = generateToken(60 * 60, user);
//           db.collection("RefreshTokens").add({
//             refreshToken: refreshToken,
//             date: new Date(),
//           });

//           res.status(200).send({ token, refreshToken, user });
//         }
//       });

//       if (!userFound) {
//         res.status(400).send({ message: "Bad username or password!" });
//       }
//     })
//     .catch((error: any) => {
//       console.log("Error getting users:", error);
//       res.status(500).send("Error getting users");
//     });
// });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const usersSnapshot = await db
      .collection("Users")
      .where("username", "==", username)
      .get();
    if (usersSnapshot.empty) {
      return res.status(404).send({ message: "Bad username or password!" });
    }

    const userDoc = usersSnapshot.docs[0];
    const user = userDoc.data();

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Authentication failed.");
    }

    // Passwords match, authentication successful
    console.log("Passwords match! User authenticated.");
    delete user.password; // Remove password before sending user data
    const token = generateToken(60, user);
    const refreshToken = generateToken(60 * 60, user);
    await db.collection("RefreshTokens").add({
      refreshToken: refreshToken,
      date: new Date(),
    });

    // Send response
    res.status(200).send({ token, refreshToken, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "An error occurred during login." });
  }
});

app.delete("/logout", (req, res) => {
  const refreshTokenFromPost: string = req.body.refreshToken;

  const refreshTokenRef = db.collection("RefreshTokens");

  const fetchData = async function () {
    try {
      const refreshTokenQuery = await refreshTokenRef
        .where("refreshToken", "==", refreshTokenFromPost)
        .get()
        .then((docSnapShot: any) => {
          if (docSnapShot.empty) {
            res.status(400).send("Token not found!");
            return;
          }
          for (const doc of docSnapShot.docs) {
            if (doc.data().refreshToken === refreshTokenFromPost) {
              refreshTokenRef.doc(doc.id).delete();
              res.status(200).send({ message: "Logged out!" });
              break;
            }
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function generateToken(expirationInSeconds: number, user?: any) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
  const token = jwt.sign({ exp, user }, tokenSecret, {
    algorithm: "HS256",
  });
  return token;
}

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(403);

  console.log(token);

  jwt.verify(token, tokenSecret, (err: any, user: any) => {
    if (err) {
      console.log(err);
      return res.status(401).send(err.message);
    }
    req.user = user;
    next();
  });
}

// Schedule a task to run every 24 hours
cron.schedule("0 0 * * *", async () => {
  const now = admin.firestore.Timestamp.now();
  const twentyFourHoursAgo = admin.firestore.Timestamp.fromDate(
    new Date(now.toDate().getTime() - 24 * 60 * 60 * 1000)
  );

  const expiredTokensSnapshot = await admin
    .firestore()
    .collection("RefreshTokens")
    .where("date", "<", twentyFourHoursAgo)
    .get();

  const batch = admin.firestore().batch();

  expiredTokensSnapshot.docs.forEach((doc: any) => {
    batch.delete(doc.ref);
  });
  console.log("done");
  return batch.commit();
});
