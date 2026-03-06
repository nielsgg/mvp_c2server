import http from "http";

const PORT = 3000;

/**
 * Simple backend hashtable
 */
const data = new Map<string, { name: string; age: number }>();

data.set("1", { name: "Alice", age: 25 });
data.set("2", { name: "Bob", age: 30 });
data.set("3", { name: "Charlie", age: 28 });

function renderTable(): string {
  let rows = "";

  for (const [id, user] of data.entries()) {
    rows += `
      <tr>
        <td>${id}</td>
        <td>${user.name}</td>
        <td>${user.age}</td>
      </tr>
    `;
  }

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Hello Node</title>
    <style>
      body { font-family: Arial; padding: 40px; }
      table { border-collapse: collapse; width: 400px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      th { background: #eee; }
    </style>
  </head>
  <body>
    <h1>Hello World Node + TypeScript</h1>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

  </body>
  </html>
  `;
}

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    const html = renderTable();

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});