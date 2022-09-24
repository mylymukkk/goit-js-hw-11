import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayApi from './js/pixabay-api';

const searchForm = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

const pixabayApi = new PixabayApi();
let lightbox = new SimpleLightbox('.gallery a');

let currentHits = 0;

searchForm.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  pixabayApi.query = event.target.elements.searchQuery.value;
  pixabayApi.page = 1;

  if (event.target.elements.searchQuery.value === '') {
    Notiflix.Notify.failure('Please, fill in your request.');
    return;
  }
  loadMoreBtn.classList.add('is-hidden');
  loadMoreBtn.removeEventListener('click', onLoadMore);

  try {
    pixabayApi.fetchPhoto().then(data => {
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      markUp(data.hits);
      currentHits = data.hits.length;
      lightbox.refresh();
      loadMoreBtn.classList.remove('is-hidden');
      loadMoreBtn.addEventListener('click', onLoadMore);
    });
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  pixabayApi.page += 1;
  const data = await pixabayApi.fetchPhoto();
  markUp(data.hits);
  currentHits += data.hits.length;
  lightbox.refresh();
  if (currentHits === data.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    loadMoreBtn.removeEventListener('click', onLoadMore);
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function markUp(photos) {
  photos.forEach(photo => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');
    photoCard.innerHTML = `<a href="${photo.largeImageURL}"><img class="preview" src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${photo.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${photo.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${photo.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${photo.downloads}
    </p>
  </div></a>`;
    gallery.appendChild(photoCard);
  });
}
