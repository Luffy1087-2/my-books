import app from "./server.js";

const PORT = 3001; 
app.listen(3001, () => {
  console.log(`api servere is running on port ${PORT}`);
});