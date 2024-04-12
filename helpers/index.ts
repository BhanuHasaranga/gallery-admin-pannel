const fetchSingleAlbum = async (name: string) => {
    try {
      const response = await fetch(`/api/albums/album?name=${name}`);
      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching albums:", error);
      // Handle error state if needed
    }
};