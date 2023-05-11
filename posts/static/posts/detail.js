
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')
const backBtn = document.getElementById('back-btn')

const dataUrl = window.location.href + "data/"
const updateUrl = window.location.href + "update/"
const deleteUrl = window.location.href + "delete/"

const updateForm = document.getElementById('update-form')
const deleteForm = document.getElementById('delete-form')

const spinnerBox = document.getElementById('spinner-box')
const postBox = document.getElementById('post-box')
const alertBox = document.getElementById('alert-box')

const titleInput = document.getElementById('id_title')
const bodyInput = document.getElementById('id_body')

const songTitleInput = document.getElementById('id_song_title')
const artistInput = document.getElementById('id_artist')
const yearInput = document.getElementById('id_year')
const audiofileInput = document.getElementById('id_audiofile')

const csrf = document.getElementsByName('csrfmiddlewaretoken')

backBtn.addEventListener('click', ()=>{
    history.back()
})

$.ajax({
    type: 'GET',
    url: dataUrl,
    success: function(response){
        const data = response.data
        console.log(data)
        if(data.logged_in !== data.author){
            console.log('author and logged_in are different')
        } else {
            console.log('author and logged_in are same')
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        }

        //se response è un song post
        if (data.song_title){

            const songTitleEl = document.createElement('h3')
            songTitleEl.setAttribute('class', 'mt-3')
            songTitleEl.setAttribute('id', 'song-title')
            const artistEl = document.createElement('p')
            artistEl.setAttribute('class', 'mt-1')
            artistEl.setAttribute('id', 'artist')
            const audioPlayerEl = document.createElement('audio')
            audioPlayerEl.controls = true
            audioPlayerEl.setAttribute('class', 'mt-1')
            audioPlayerEl.setAttribute('id', 'audio-player')
            audioPlayerEl.setAttribute('src', '/media/audio/'+data.song_title+'.mp3')

            songTitleEl.textContent = data.song_title
            artistEl.textContent = data.artist+' ('+data.year+')'

            songTitleInput.value = data.song_title
            artistInput.value = data.artist
            yearInput.value = data.year

            postBox.appendChild(songTitleEl)
            postBox.appendChild(artistEl)
            postBox.appendChild(audioPlayerEl)

        } else {
        //se response è un text post, se aggiungo nuovo tipo di post devo gestire con elif
            const titleEl = document.createElement('h3')
            titleEl.setAttribute('class', 'mt-3')
            titleEl.setAttribute('id', 'title')
            const bodyEl = document.createElement('p')
            bodyEl.setAttribute('class', 'mt-1')
            bodyEl.setAttribute('id', 'body')

            titleEl.textContent = data.title
            bodyEl.textContent = data.body

            titleInput.value = data.title
            bodyInput.value = data.body

            postBox.appendChild(titleEl)
            postBox.appendChild(bodyEl)
        }

        spinnerBox.classList.add('not-visible')
    },
    error: function(error){
        console.log(error)
    }
})

updateForm.addEventListener('submit', e => {
    e.preventDefault()
    if(document.getElementById('title')){
        console.log('textpost');
        const title = document.getElementById('title')
        const body = document.getElementById('body')

        $.ajax({
            type: 'POST',
            url: updateUrl,
            data: {
                'csrfmiddlewaretoken': csrf[0].value,
                'title': titleInput.value,
                'body': bodyInput.value,
            },
            success: function(response){
                console.log(response)
                handleAlerts('success', 'Post has been updated! :)')
                title.textContent = response.title
                body.textContent = response.body
            },
            error: function(error){
                console.log(error)
            }
        })
    } else {
        const songTitle = document.getElementById('song-title')
        const artist = document.getElementById('artist')
        const audioPlayer = document.getElementById('audio-player')
        
        $.ajax({
            type: 'POST',
            url: updateUrl,
            data: {
                'csrfmiddlewaretoken': csrf[0].value,
                'song_title': songTitleInput.value,
                'artist': artistInput.value,
            },
            success: function(response){
                console.log(response)
                handleAlerts('success', 'Post has been updated! :)')
                songTitle.textContent = response.title
                artist.textContent = response.artist
                
            },
            error: function(error){
                console.log(error)
            }
        })
    }
})

deleteForm.addEventListener('submit', e => {
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: deleteUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
        },
        success: function(response){
            window.location.href = window.location.origin
            if(titleInput){
                localStorage.setItem('title', titleInput.value)
            } else {
                localStorage.setItem('title', songTitleInput.value)
            }
        },
        error: function(error){
            console.log(error)
        }
    })
})