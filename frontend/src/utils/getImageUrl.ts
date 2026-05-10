/**
 * Helper untuk membersihkan dan memformat URL gambar dari backend.
 * @param fotoArray - Array of string path gambar dari database
 * @returns URL gambar lengkap dengan Base URL backend
 */
export const getImageUrl = (fotoArray: string[] | undefined | null) => {
  if (!fotoArray || fotoArray.length === 0 || !fotoArray[0]) {
    return "/dummy-shoe.jpg";
  }

  let path = fotoArray[0];

  if (path.startsWith("public/")) {
    path = path.replace("public/", "/");
  }

  if (path.startsWith("/root/uploads")) {
    path = path.replace("/root/uploads", "/uploads");
  }

  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const baseUrl = apiUrl.replace(/\/api$/, "");

  return `${baseUrl}${path}`;
};
