const fs = require("fs");
const fetch = require("node-fetch");

try {
    const data = fs.readFileSync("test/urls.txt", "utf8");
    const dataArray = data.split("\n");

    dataArray.forEach(async (element) => {
        const domain = element.split(".")[0];
        const body = { link: element.trim(), alias: domain };

        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await fetch(
            "https://url-shortener.cyclic.app/shortener",
            {
                method: "post",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            }
        );

        const data = await response.json();

        console.log(data.status);
    });
} catch (err) {
    console.error(err);
}
