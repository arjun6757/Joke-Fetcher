$(document).ready(function () {
    // by default the any value should be selected
    $('input[name="categories-choice"][value="any"]').prop('checked', true);
    // by default the safe value should be selected
    $('input[type="checkbox"][value="safe"]').prop('checked', true);

    let selectedParameters = '';
    // initially it will check
    updateCategoryState();
    ifSafeThenDisableFlagOptions();
    
    $('input[type="checkbox"][value="safe"]').off('change').on('change', function() {
        ifSafeThenDisableFlagOptions();
    });

    function ifSafeThenDisableFlagOptions() {
        const isSafe = $('input[type="checkbox"][value="safe"]').is(':checked');

        if(isSafe) {
            $('input[name="flags"]').prop('checked', false).prop('disabled', true);
        }
        else {
            $('input[name="flags"]').prop('disabled', false);
        }
    }

    $('input[name="categories-option"]').off('change').on('change', function () {
        checkOptions();
        });

    function checkOptions() {
        console.log('entering checkOptions');
        const selectedCategories = [];
        $('input[name="categories-option"]:checked').each(function() {
            console.log(`selected category: ${$(this).val()}
            \npushing this value to the selectedCategories array`);
            selectedCategories.push($(this).val());
        });

        if(selectedCategories.length > 0) {
            selectedParameters = selectedCategories.join(',');
        } else {
            // if there is nothing in there
            selectedCategories.push('any');
            selectedParameters = selectedCategories.join('');
        }

        console.log(`selected paramters or categories: ${selectedParameters}`);
        fetchJokes(selectedParameters);
    }   
    
    async function fetchJokes(selectedParameters) {
        try {
            const response = await axios.get(`https://v2.jokeapi.dev/joke/${selectedParameters}`);
            const result = response.data;
            //now i need to pass this data to the container
            console.log('we are in the async function\nresponse: ', result);
            updateContainer(result);
        } catch (error) {
            console.error('error: ', error);
        }
    } 

    $('input[name="categories-choice"]').on('change', function () {
        updateCategoryState();
        $('input[name="categories-option"]').off('change').on('change', function () {
        checkOptions();
        });
    });

    function updateCategoryState() {
        const isAnyChecked = $('#category-any').is(':checked');
        const isCustomChecked = $('#category-custom').is(':checked');
        
        // for debugging purpose
        console.log('any: ' + isAnyChecked);
        console.log('custom: ', isCustomChecked);

        if (isAnyChecked) {
            $('input[name="categories-option"]').prop('checked', false).prop('disabled', true);
        }
        else if (isCustomChecked) {
            $('#category-any').prop('checked', false);
            $('input[name="categories-option"]').prop('disabled', false);
        }
    }

    $(".content-container").on('click', '.setup', function () {
        $(".delivery").toggle();
    });

    $(".content-container").on('click', '.delivery', function () {
        $(".setup").toggle();
    });

    $("#refresh-btn").on('click', function () {
        if(selectedParameters.length > 0) {
            // this section will run when user selected and then marked off all the options
            console.log('selectedParameters.length: ', selectedParameters.length);
            console.log(`we are on the if sections of refresh button on click event: ${selectedParameters}`);
            fetchJokes(selectedParameters);
        } else {
            console.log(`we are on the else sections of the refresh button on click event= we dont actually need selectedParamters here as im generating any category content from the server :)`);
            fetch('/json', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                updateContainer(data);
            })
            .catch(error => {
                console.log('Error: ', error);
            });

        }

    });

    function updateContainer(Jokes) {
        $(".content-container").html('');
        if (Jokes.type == 'twopart') {
            const setup = $("<h1></h1>").addClass('setup');
            setup.text(Jokes.setup);
            const delivery = $("<h2></h2>").addClass('delivery');
            delivery.text(Jokes.delivery);
            $(".content-container").append(setup).append(delivery);
        }
        else if (Jokes.type == 'single') {
            const setup = $("<h1></h1>").addClass('setup');
            setup.text(Jokes.joke);
            $(".content-container").append(setup);
        }
    }
});
