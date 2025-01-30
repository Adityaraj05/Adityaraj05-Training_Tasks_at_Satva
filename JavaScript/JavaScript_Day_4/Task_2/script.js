$(document).ready(function () {
    $('#loader').hide();

    function loadContent(page){
        $(`#loader`).show();


        $.ajax({
            url: page,
            method: 'GET',
            success: function (data){
                setTimeout(function () {
                    $('#content').html(data);
                    $('#loader').hide();
                }, 100);
            },
            error: function(){
                setTimeout(function () {
                    $('#content').html(`<h2>Error loading content.</h2>`);
                    $('#loader').hide();
                }, 100);
            }
        });
    }

    $('#index').click(function () {
        $('#content').html(`
            <h2>Welcome to my Webpage</h2>
        `);
    });

    $('#home').click(function () {
        loadContent('Home.html');
    });
    $('#about').click(function () {
        loadContent('About.html');
    });
    $('#contact').click(function () {
        loadContent('Contact.html');
    });
    $('#team').click(function () {
        loadContent('Team.html');
    });
});