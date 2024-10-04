// type Profile = {
//   id: string;
//   name: string;
// };

// interface Root {
//   id: string;
//   name: string;
//   properties: Property[];
//   profileActions: any[];
// }

// interface Property {
//   name: string;
//   value: string;
//   signature: string;
// }

// app.get('/name/skin/:username', async (req, res) => {
//   const username = req.params.username;
//   const APIURL = `https://api.mojang.com/users/profiles/minecraft/${username}`;

//   try {
//     const response = await fetch(APIURL);
//     const data = (await response.json()) as Profile;
//     const uuid = data.id;
//     const skinUrl = `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}?unsigned=false`;
//     const skinResponse = await fetch(skinUrl);
//     const skinData = (await skinResponse.json()) as Root;
//     const textures = skinData.properties[0].value;
//     const decodedTextures = Buffer.from(textures, 'base64').toString('utf-8');
//     const skinURL = JSON.parse(decodedTextures).textures.SKIN.url;
//     const skinImageResponse = await fetch(skinURL);
//     const skinImageArrayBuffer = await skinImageResponse.arrayBuffer();
//     const skinImageBuffer = Buffer.from(skinImageArrayBuffer);
//     const image = await Jimp.read(skinImageBuffer);
//     const enlargedImageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
//     res.setHeader('Content-Type', 'image/png');
//     res.send(enlargedImageBuffer);
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ error: 'Internal Server Error', details: ' error' });
//   }
// });
