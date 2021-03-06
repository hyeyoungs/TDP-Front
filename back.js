let urlEndpoint = 'https://api.tildp.shop/subscribe';
// let urlEndpoint = 'http://localhost:8080/subscribe';
let eventSource = new EventSource(urlEndpoint);

let domainURL= 'https://api.tildp.shop';
// let domainURL= 'http://localhost:8080';

eventSource.addEventListener("newPublicPost", function (event) {
    let articleData = JSON.parse(event.data);
    let title = articleData.tilTitle;
    let message = 'β° [ New Post! ] β  π  ' + title;
    displayToast('Bottom Right', message)
});

eventSource.addEventListener("newPrivatePost", function (event) {
    let message = 'β° [ New Post! ] β  π  private TIL';
    displayToast('Bottom Right', message)
});

function displayToast(position, message) {
    bulmaToast.toast({
        message: message,
        type: 'is-danger is-light',
        position: position.toLowerCase().replace(' ', '-'),
        dismissible: true,
        duration: 4000,
        pauseOnHover: true,
        animate: { in: 'fadeIn', out: 'fadeOut' },
    })
}

function login_check(options, originalOptions, jqXHR){
    if(localStorage.getItem('token')) {
        jqXHR.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    } else {
        alert("λ‘κ·ΈμΈ ν΄μ£ΌμΈμ")
        location.href =  `/index.html`
    }
}

function sign_out() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    alert('λ‘κ·Έμμ!')
    window.location.href = "/"
}

function read_user() {
    $.ajax({
        type: "GET",
        url: `${domainURL}/user`,
        success: function (response) {
            let user_info = response;
            $('.user_id_append').text(user_info['username']);
            $('.user_nickname_append').text(user_info['nickname']);
            $('.user_profile_info_append').text(user_info['introduce']);
            $('.user_profile_pic_append').text(user_info['picture']);
            $('.github_id_append').text(user_info['github_id']);
            $('.user_id_append').val(user_info['username']);
            $('.user_nickname_append').val(user_info['nickname']);

            $('.user_profile_info_append').val(user_info['introduce']);
            $('.user_profile_pic_append').val(user_info['picture']);
            $('.user_profile_pic_real_append').attr('src', user_info['picture_real']);
            $('.github_id_append').val(user_info['github_id']);

            let github_id = user_info['github_id']
            if (github_id == null || github_id === ""){
                $('.github_id_tag').hide();
            }

            let introduce = user_info['introduce']
            if (introduce == null || introduce === ""){
                $('#introduce').hide();
            }

        }
    });
}

function chat_user() {
    $.ajax({
        type: "GET",
        url: `${domainURL}/user`,
        async: false,
        success: function (response) {
            user_info = response;
        }
    });
    return user_info;
}

function read_flag() {
    let today = new Date();
    let result_date;
    $.ajax({
        type: "GET",
        url: `${domainURL}/til/user`,
        data: {},
        success: function (response) {
            let all_til = response;
            if (all_til.length === 0) {
                $(".test").css("background-color", 'red');
                return
            }
            result_date = new Date(all_til[0]['createdAt']);
            if (today.toDateString() === result_date.toDateString()) {$(".test").css("background-color", 'blue'); }
            else{   $(".test").css("background-color", 'red')  }
        }
    });
}

function tokenCheckRequest() {
    $.ajax({
        type: "GET",
        url: "${domainURL}/user",
        error: function (response) {
            alert(response.responseJSON.message);
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            location.href =  `/index.html`
        }
    })
}
