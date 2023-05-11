const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')

const audioPostForm = document.getElementById('audio-post-form')
const songTitle = document.getElementById('id_song_title')
const artist = document.getElementById('id_artist')
const year = document.getElementById('id_year')
const audiofile = document.getElementById('id_audiofile')

const csrf = document.getElementsByName('csrfmiddlewaretoken')

const url = window.location.href

const alertBox = document.getElementById('alert-box')

// $.ajax({
//     type: 'GET',
//     url: '/hello-world/',  //url è dove andrò a prendere la JsonResponse (nella view infatti deve esserci jsonresponse)
//     success: function(response){
//         console.log('success', response.text) //NB HO SUCCESSO DOVE LA RICHIESTA VA A BUON FINE (NON LA RISPOSTA) QUINDI BASTA CHE L'URL ESISTA TRA LE MIE VISTE, NON DEVE PER FORZA ESSERE 'hello-world'
//         helloWorldBox.textContent = response.text
//     },
//     error: function(error){
//         console.log('error', error)     //NB C'è ERRORE SE RICHIEDO UNA RISORSA CHE NON ESISTE QUINDI SE L'URL RICHIESTO NON ESISTE
//     }
// })

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken')

const deleted = localStorage.getItem('title')
if(deleted){
    handleAlerts('danger', `Deleted "${deleted}"!`)
    localStorage.clear()
}

const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')] //array of forms
    likeUnlikeForms.forEach(form => form.addEventListener('submit', e=>{
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
        console.log(clickedId)
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)
        $.ajax({
            type: 'POST',
            url:"/like-unlike/",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId,
            },
            success: function(response){
                console.log(response)
                clickedBtn.textContent = response.liked ? `Unlike (${response.count})`: `Like (${response.count})`
            },
            error: function(error){
                console.log(error)
            }
        })
    }))
}

let visible = 3

const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/data/${visible}`,
        success: function(response){
            console.log(response)
            const data = response.data
            setTimeout(() => {
                spinnerBox.classList.add('not-visible')
                data.forEach(el => {
                    if(el.song_title){
                        console.log(el.song_title)
                        postsBox.innerHTML += `
                            <div class="card mb-2">
                                <div style="display:flex; justify-content:space-between" class="card-body">
                                    <div style="flex-direction:column">
                                        <h5 class="class-title">${el.song_title}</h5>
                                        <p class="card-text">${el.artist}</p>
                                    </div>
                                    <div style="margin-right:1rem">
                                        <audio controls>
                                            <source src="/media/audio/${el.song_title}.mp3" type="audio/mpeg">
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <div class="row">
                                        <div class="col-2">
                                            <a href="${url}${el.id}/song/" class="btn btn-primary">Details</a>
                                        </div>
                                        <div class="col-2">
                                            <form class="like-unlike-forms" data-form-id="${el.id}">
                                                <button href="#" class="btn btn-primary" id="like-unlike-${el.id}">${el.liked ? `Unlike (${el.count})`: `Like (${el.count})`}</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        `
                    } else {
                        postsBox.innerHTML += `
                            <div class="card mb-2">
                                <div class="card-body">
                                    <h5 class="class-title">${el.title}</h5>
                                    <p class="card-text">${el.body}</p>
                                </div>
                                <div class="card-footer">
                                    <div class="row">
                                        <div class="col-2">
                                            <a href="${url}${el.id}/text/" class="btn btn-primary">Details</a>
                                        </div>
                                        <div class="col-2">
                                            <form class="like-unlike-forms" data-form-id="${el.id}">
                                                <button href="#" class="btn btn-primary" id="like-unlike-${el.id}">${el.liked ? `Unlike (${el.count})`: `Like (${el.count})`}</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        `
                    }
                });
                likeUnlikePosts()
            }, 100)
            console.log(response.size)
            if(response.size === 0){
                endBox.textContent = 'Non c\'è ancora nessun post...'
            }
            else if(response.size <= visible){
                loadBtn.classList.add('not-visible')
                endBox.textContent = 'Non ci sono altri post da caricare...'
            }
        },
        error: function(error){
            console.log(error)
        }
    })
}

loadBtn.addEventListener('click', ()=>{
    spinnerBox.classList.remove('not-visible')
    visible += 3
    getData()
})

postForm.addEventListener('submit', e=>{
    e.preventDefault() //questo fa si che il form non sia submittato quindi non si aggiornerà la pagina

    $.ajax({
        type: 'POST',
        url:'',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'body': body.value,
        },
        success: function(response){
            console.log(response)
            postsBox.insertAdjacentHTML('afterbegin',`
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="class-title">${response.title}</h5>
                        <p class="card-text">${response.body}</p>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-2">
                                <a href="${response.id}/text/" class="btn btn-primary">Details</a>
                            </div>
                            <div class="col-2">
                                <form class="like-unlike-forms" data-form-id="${response.id}">
                                <button href="#" class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>
                            </form>
                            </div>
                        </div>
                    </div>  
                </div>
            `)
            likeUnlikePosts()
            $('#addPostModal').modal('hide')
            handleAlerts('success', 'Il post è stato creato! :)')
            postForm.reset()
        },
        error: function(error){
            console.log(error)
            handleAlerts('danger', 'Qualcosa è andato storto nella creazione del post :(')
        }
    })
})

audioPostForm.addEventListener('submit', e=>{
    e.preventDefault() //questo impedisce alla pagina di aggiornarsi (sto facendo chiamata asincrona quindi non c'è bisogno)

    let formData = new FormData();
    formData.append('csrfmiddlewaretoken', csrf[0].value)
    formData.append('song_title', songTitle.value)
    formData.append('artist', artist.value)
    formData.append('year', year.value)
    formData.append('audiofile', audiofile.files[0])

    $.ajax({
        type: 'POST', 
        url:'',
        data: formData,
        cache: false,
		contentType: false,
		processData: false,
        success: function(response){
            console.log(response)
            postsBox.insertAdjacentHTML('afterbegin',`
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="class-title">${response.song_title}</h5>
                        <p class="card-text">${response.artist}</p>
                        <div style="margin-right:1rem">
                            
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-2">
                                <a href="${response.id}/song/" class="btn btn-primary">Details</a>
                            </div>
                            <div class="col-2">
                                <form class="like-unlike-forms" data-form-id="${response.song_id}">
                                <button href="#" class="btn btn-primary" id="like-unlike-${response.song_id}">Like (0)</button>
                            </form>
                            </div>
                        </div>
                    </div>  
                </div>
            `)
            likeUnlikePosts()
            $('#addAudioPostModal').modal('hide')
            handleAlerts('success', 'Il post audio è stato creato! :)')
            audioPostForm.reset()
        },
        error: function(error){
            console.log(error)
            handleAlerts('danger', 'Qualcosa è andato storto nella creazione del post audio :(')
        }
    })
})

getData()
