import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
    try {
        let url = req.query.url;
        if (!url) return res.send("Missing URL");

        if (!url.startsWith("http")) url = "https://" + url;

        const response = await fetch(url);
        let body = await response.text();

        res.set("Content-Type", response.headers.get("content-type") || "text/html");
        res.set("X-Frame-Options", "ALLOWALL");
        res.set("Content-Security-Policy", "");

        res.send(body);

    } catch (e) {
        res.send("Error loading URL");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy running on port", PORT));
