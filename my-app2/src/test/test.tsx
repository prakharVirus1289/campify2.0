export default function Test() {
  return (
    <div>
      <h1>Test</h1>
      <form action="http://localhost:3000/m_messages" method="post" encType="multipart/form-data">
        <input type="file" name="media" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Submit</button>
      </form>
    </div>
  );
}