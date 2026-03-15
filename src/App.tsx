import { useState } from "react";
import { fetchPosts } from "./Api";

type Post = {
  id: number;
  title: string;
  body: string;
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  const loadPosts = async () => {
    const data = await fetchPosts();
    setPosts(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Offline React App</h1>
      <br/>
      <br/>
      <button onClick={loadPosts}>Load Posts</button>
      <br/>
      <br/>
      <table border={1}>
        {posts.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.title}</td>
            <td>{p.body}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
