import axios from 'axios';

const key = '30103926-bc1271f834f2572d4e26830c5';

export default class PixabayApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perpage = 40;
  }

  async fetchPhoto() {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${key}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perpage}`
    );
    return response.data;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
