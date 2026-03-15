export const fetchPosts = async () => {
  try {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=5"
    );

    const data = await res.json();
    localStorage.setItem("posts", JSON.stringify(data));
    return data;
  } catch (e) {
    console.log("offline → loading cache");

    const cached = localStorage.getItem("posts");

    return cached ? JSON.parse(cached) : [];
  }
};
