// Function for event-driven functions to execute once all DOM contents are loaded
document.addEventListener('DOMContentLoaded', function() {
  // Listen to clicks for submitting new posts when it's available
  if (document.querySelector('#content')) {
    document.querySelector('#content').addEventListener('click', () => create_post());
  }
  // Listen to clicks for following link when it's available
  if (document.querySelector('#following')) {
      document.querySelector('#following').addEventListener('click', () => load_following_posts(filter = "following", page=1));
  }  
  // By default, load all posts
  load_posts(filter=0, page=1);
});

// Function to create a new post
function create_post() {

  // Show the all posts view and hide other views
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#allposts-view').style.display = 'block';
  document.querySelector('#following-view').style.display = 'none';

  // Retrieve post information while setting fixed variables as const
  var content = document.querySelector('#post_content').value;
  
  // Create post information
  fetch('/create_post', {
    method: 'POST',
    // Send Django CSRF Token
    headers:{
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
        content: content
    })
  })
  .then(response => response.json())
  .then(result => {
     // Print result
     console.log(result);
   });
   // Reset value of the form
   document.querySelector('#post_content').value = '';
   // Pause for 200 milisecond to ensure post is updated before loading
   sleep(200);
   return true;
}

// Function to load all posts
function load_posts(filter, page) {
  
  // Show the all posts view and hide other views
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#allposts-view').style.display = 'block';
  document.querySelector('#following-view').style.display = 'none';

  // Get posts information
  fetch(`posts/${filter}/${page}`)
  .then(response => response.json())
  .then(response => {
    pagination(filter, page, response.num_pages);
    console.log(response.posts);
    // Display posts
    response.posts.forEach(post => display_post(post));
  });

}

// Function to load filtered posts while avoid having prpfile-view to be hidden
function load_filtered_posts(filter, page) {
  
  // Get posts information
  fetch(`posts/${filter}/${page}`)
  .then(response => response.json())
  .then(response => {
    pagination(filter, page, response.num_pages);
    console.log(response.posts);
    // Display posts
    response.posts.forEach(post => display_post(post));
    });
}

// Function to load following posts
function load_following_posts(filter, page) {
  
  // Show the following view and hide other views
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#allposts-view').style.display = 'none';
  document.querySelector('#following-view').style.display = 'block';

  // Reset the contents of following-view to blank
  document.getElementById('following-view').innerHTML = '';
  
  // Get following posts information
  fetch(`/following_posts/${page}`)
  .then(response => response.json())
  .then(response => {
    pagination(filter, page, response.num_pages);
    console.log(response.posts);
    // Display posts
    response.posts.forEach(post => display_post(post));
  });
}

// Function to display pagination feature
function pagination(filter, page, num_pages) {
  
  // Create pagination wrapper
  const pagination = document.createElement('ul');
  pagination.className = "pagination";
  pagination.innerHTML = "";
  document.getElementById("allposts").innerHTML = "";

  // Previous and page 1 button
  const previous = document.createElement('li');
  // Only enable previous page icon when current page is not 1
  if (page === 1) {
    previous.className = "page-item disabled";
  }
  else {
    previous.className = "page-item";
    if (filter === "following") {
      previous.addEventListener('click', () => load_following_posts(filter, page-1));
    }
    else {
      previous.addEventListener('click', () => load_filtered_posts(filter, page-1));
    }
  }
  // Create link to navigate pages
  const prev_anchor = document.createElement('a');
  prev_anchor.className = "page-link";
  prev_anchor.innerHTML = "Previous";
  prev_anchor.href = "#";
  previous.append(prev_anchor);
  pagination.append(previous);

  // Pages in the middle
  // Loop through middle pages for navigation
  for (let page_item=1; page_item<=num_pages; page_item++) {
    const middle = document.createElement('li');
    if (page_item === page) {
      middle.className = "page-item active";
    }
    else {
      middle.className = "page-item";
      if (filter === "following") {
        middle.addEventListener('click', () => load_following_posts(filter, page_item));
      }
      else {
        middle.addEventListener('click', () => load_filtered_posts(filter, page_item));
      }
    }
    // Create link to navigate pages
    const mid_anchor = document.createElement('a');
    mid_anchor.className = "page-link";
    mid_anchor.innerHTML = page_item;
    mid_anchor.href = "#";
    middle.append(mid_anchor);
    pagination.append(middle);
  }

  // Last and page max button
  const next = document.createElement('li');
  // Only enable last page icon when current page is not the maximum page
  if (page === num_pages) {
    next.className = "page-item disabled";
  }
  else {
    next.className = "page-item";
    if (filter === "following") {
      next.addEventListener('click', () => load_following_posts(filter, page+1));
    }
    else {
      next.addEventListener('click', () => load_filtered_posts(filter, page+1));
    }
  }
  // Create link to navigate pages
  const next_anchor = document.createElement('a');
  next_anchor.className = "page-link";
  next_anchor.innerHTML = "Next";
  next_anchor.href = "#";
  next.append(next_anchor);
  pagination.append(next);

  // Append pagination wrapper to different views
  if (filter === 0) {
    document.querySelector('#allposts').append(pagination);
  }
  else if (filter === "following") {
    document.querySelector('#following-view').append(pagination);
  }
  else {
    document.querySelector('#profile-view').append(pagination);
  }
};

// Function to display all posts
function display_post(post) {
  
  // Create a wrapping div to append all displaying elements
  const post_block = document.createElement('div');
  post_block.className = "post_block";
  
  // Display user name of the post
  const user_name = document.createElement('div');
  user_name.className = "user_name";
  user_name.innerHTML = post.username;
  post_block.append(user_name);
  
  // Display content of the post
  const content = document.createElement('div');
  content.id = `${post.id}_post_content`;
  content.className = "post_content";
  content.innerHTML = post.content;
  post_block.append(content);
  
  // Display creation date time of the post
  const date_time = document.createElement('div');
  date_time.className = "date_time";
  const format_timestamp = format_datetime(new Date(post.date_time));
  date_time.innerHTML = format_timestamp;
  post_block.append(date_time);
  
  // Display number of likes of the post
  const num_like = document.createElement('div');
  num_like.className = "num_like";
  num_like.id = `${post.id}_num_like`;
  num_like.innerHTML = post.num_like;
  post_block.append(num_like);

  // Create like icon for post
  const heart = document.createElement('img');
  heart.className = "heart hvr-grow";
  heart.id = `${post.id}_heart`;
  heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Heart_icon_red_hollow.svg/812px-Heart_icon_red_hollow.svg.png";
  post_block.append(heart);

  // Make sure user is eligible to like a post
  if (post.eligible_like) { 
    // Then check if user is already liking the post to display the right heart icon
    if (post.already_like) {
      heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png";
    }
    // Run like or unlike function once heart icon is clicked
    heart.addEventListener('click', () => like_unlike(post));
  }
  // If user is not eligible to like a post then hike the heart icon
  else {
    heart.style.display = 'none';
  }

  // Create edit link for user's post only
  if (document.getElementById('username')){
    // Check if the post is belong to logged in user
    if (post.username === document.getElementById('username').innerHTML) {
      const edit = document.createElement('a');
      edit.className = "edit";
      edit.id = `${post.id}_edit`
      edit.innerHTML = "Edit";
      // Enable user to click on the edit link to see edit post
      edit.addEventListener('click', () => edit_post(post));
      post_block.append(edit);
    }
  }

  // Enable user to click on a user name to see profile page
  user_name.addEventListener('click', () => display_profilepage(post.userid, post.username));

  // Append wrapper to the appropriate views
  if (filter === 0) {
    document.querySelector('#allposts').append(post_block);
  }
  else if (filter === "following") {
    document.querySelector('#following-view').append(post_block);
  }
  else {
    document.querySelector('#profile-view').append(post_block);
  }
}

// Function to allow user to edit his/her own posts
function edit_post(post) {
  // Get children belong to the post user has chose to edit
  const old_content = document.getElementById(`${post.id}_post_content`);
  const edit = document.getElementById(`${post.id}_edit`);
  const post_block = old_content.parentNode;
  
  // Hide the original content and edit icon
  old_content.style.display = "none";
  edit.style.display = "none";
  
  // Create editable text area
  const update_content = document.createElement('textarea');
  update_content.innerHTML = old_content.innerHTML;

  // Create save link
  const save = document.createElement('a');
  save.className = "save";
  save.innerHTML = "save";

  // Create cancel link
  const cancel = document.createElement('a');
  cancel.className = "cancel";
  cancel.innerHTML = "cancel";

  // Append the new text area, save icon and cancel icon to the post
  post_block.insertBefore(update_content, post_block.children[2]);
  post_block.insertBefore(save, post_block.children[3]);
  post_block.insertBefore(cancel, post_block.children[4]);

  // Update the post content
  save.addEventListener('click', () => {
    fetch('/create_post', {
      method: 'PUT',
      // Send Django CSRF Token
      headers:{
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
          id: post.id,
          content: update_content.value
      })
    })
    .then(response => response.json())
    .then(result => {
       // Print result
       console.log(result);
    });

    // Remove the new items after saving the post
    update_content.remove();
    save.remove();
    cancel.remove();
    old_content.innerHTML = update_content.value;
    // Unhide the original content and edit icon
    old_content.style.display = "block";
    edit.style.display = "block";
  })
  // Remove the new items after cancelling the editing
  cancel.addEventListener('click', () => {
    update_content.remove();
    save.remove();
    cancel.remove();
    // Unhide the original content and edit icon
    old_content.style.display = "block";
    edit.style.display = "block";
  })


}

// Function to display profile page
function display_profilepage(userid, username) {
  
  // Show the profile page and hide other views
  document.querySelector('#profile-view').style.display = 'block';
  document.querySelector('#allposts-view').style.display = 'none';
  document.querySelector('#following-view').style.display = 'none';

  // Reset the contents of following-view to blank
  document.getElementById('profile-view').innerHTML = '';

  // Query to pull profile contents: profile name, follower num, following num, status of follow/unfollow
  fetch(`/profile/${userid}`)
  .then(response => response.json())
  .then(profile => {
      // Print follow profile
      console.log(profile);

      // Display profile name
      const profile_name = document.createElement('h1');
      profile_name.id = "profile_name";
      profile_name.innerHTML = `Profile Name: ${profile.profile_username}`;
      document.getElementById('profile-view').append(profile_name);

      // Display follower number
      const num_followers = document.createElement('div');
      num_followers.id = `${profile.id}_num_followers`;
      num_followers.innerHTML = `Followers: ${profile.followers}`;
      document.getElementById('profile-view').append(num_followers);
      
      // Display following number
      const num_following = document.createElement('div');
      num_following.id = "num_following";
      num_following.innerHTML = `Followings: ${profile.following}`;
      document.getElementById('profile-view').append(num_following);

      // Display following button
      const follow_button = document.createElement('button');
      follow_button.className = "btn btn-primary hvr-grow";
      follow_button.id = "follow_button";
      document.getElementById('profile-view').append(follow_button);

      // First check if profile is eligible to be followed by the user
      if (profile.eligible_following) { 
        // Then check if user is already following the profile to display the right follow button
        if (profile.already_following) {
          document.getElementById('follow_button').innerHTML = "Unfollow";
        } 
        else {
          document.getElementById('follow_button').innerHTML = "Follow";
        }

        // Add DOMContentLoaded to prevent button automatically been clicked before done loading
        document.addEventListener('DOMContentLoaded', function() {
          // Run follow or unfollow function once follow button is clicked
          document.querySelector('#follow_button').addEventListener('click', () => follow_unfollow(userid, username));
        });
      }
      // Hide follow button if user is not eligible to follow the profile user
      else {
        document.querySelector('#follow_button').style.display = 'none';
      }

      // Run follow or unfollow function once follow button is clicked
      document.querySelector('#follow_button').addEventListener('click', () => follow_unfollow(userid, username));
      // Get posts made by user
      load_filtered_posts(filter=userid, 1);
  });
}

// Function to follow or unfollow a user
function follow_unfollow(userid, username) {
  
  // Create follow or unfollow information
  fetch('/follow', {
    method: 'POST',
    // Send Django CSRF Token
    headers:{
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
        follow_id: userid,
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);
    // Update the display of follow button
    const follow_button = document.getElementById('follow_button');
    if (result.already_following) {
    follow_button.innerHTML = "Unfollow";
    } else {
    follow_button.innerHTML = "Follow";
    }
    // Update the number of followers
    const num_followers = document.getElementById(`${result.id}_num_followers`);
    num_followers.innerHTML = `Followers: ${result.followers}`;
   });
}

// Function to like or unlike a post
function like_unlike(post) {
  
  // Create follow or unfollow information
  fetch('/like', {
    method: 'POST',
    // Send Django CSRF Token
    headers:{
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
        post_id: post.id,
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);
    // Update the heart icon
    const heart = document.getElementById(`${result.id}_heart`);
    if (result.already_like) {
    heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png";
    } else {
    heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Heart_icon_red_hollow.svg/812px-Heart_icon_red_hollow.svg.png";
    }
    // Update the number of likes
    const num_like = document.getElementById(`${result.id}_num_like`);
    num_like.innerHTML = result.num_like;
  });
}

// Function to display customized date format
function format_datetime(date) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();

  // Determing if time should be 'am' or 'pm'
  var ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12;
  // The hour '0' should be '12'
  hour = hour ? hour : 12;
  // Minute less than 10 should have '0' displayed in first digit
  minute = minute < 10 ? '0'+minute : minute;
  
  return(`${month} ${day}, ${year}, ${hour}:${minute} ${ampm}`);
}

// Function to get CSRF token
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to pause in milliseconds
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// Dashboard portion
document.addEventListener('DOMContentLoaded', function() {
  // Main Dashboard
  const html = document.documentElement;
  const body = document.body;
  const menuLinks = document.querySelectorAll(".admin-menu a");
  const collapseBtn = document.querySelector(".admin-menu .collapse-btn");
  const toggleMobileMenu = document.querySelector(".toggle-mob-menu");
  const switchInput = document.querySelector(".switch input");
  const switchLabel = document.querySelector(".switch label");
  const switchLabelText = switchLabel.querySelector("span:last-child");
  const collapsedClass = "collapsed";
  const lightModeClass = "light-mode";

  /*TOGGLE HEADER STATE*/
  collapseBtn.addEventListener("click", function () {
    body.classList.toggle(collapsedClass);
    this.getAttribute("aria-expanded") == "true"
      ? this.setAttribute("aria-expanded", "false")
      : this.setAttribute("aria-expanded", "true");
    this.getAttribute("aria-label") == "collapse menu"
      ? this.setAttribute("aria-label", "expand menu")
      : this.setAttribute("aria-label", "collapse menu");
  });

  /*TOGGLE MOBILE MENU*/
  toggleMobileMenu.addEventListener("click", function () {
    body.classList.toggle("mob-menu-opened");
    this.getAttribute("aria-expanded") == "true"
      ? this.setAttribute("aria-expanded", "false")
      : this.setAttribute("aria-expanded", "true");
    this.getAttribute("aria-label") == "open menu"
      ? this.setAttribute("aria-label", "close menu")
      : this.setAttribute("aria-label", "open menu");
  });

  /*SHOW TOOLTIP ON MENU LINK HOVER*/
  for (const link of menuLinks) {
    link.addEventListener("mouseenter", function () {
      if (
        body.classList.contains(collapsedClass) &&
        window.matchMedia("(min-width: 768px)").matches
      ) {
        const tooltip = this.querySelector("span").textContent;
        this.setAttribute("title", tooltip);
      } else {
        this.removeAttribute("title");
      }
    });
  }

  /*TOGGLE LIGHT/DARK MODE*/
  if (localStorage.getItem("dark-mode") === "false") {
    html.classList.add(lightModeClass);
    switchInput.checked = false;
    switchLabelText.textContent = "Light";
  }

  switchInput.addEventListener("input", function () {
    html.classList.toggle(lightModeClass);
    if (html.classList.contains(lightModeClass)) {
      switchLabelText.textContent = "Light";
      localStorage.setItem("dark-mode", "false");
    } else {
      switchLabelText.textContent = "Dark";
      localStorage.setItem("dark-mode", "true");
    }
  });

  // Render historical liquidity and leverage charts
  let trace_liq = {
      x: ['2021-02-01 00:00:00', '2021-03-01 00:00:00', '2021-04-01 00:00:00'],
      y: [1.23, 1.34, 1.17],
      type: 'scatter',
      mode: "lines",
      name: 'Liquidity Ratio',
      line: {color: '#7F7F7F'}
    };

  let trace_lev = {
      x: ['2021-02-01 00:00:00', '2021-03-01 00:00:00', '2021-04-01 00:00:00'],
      y: [0.26, 0.25, 0.23],
      type: 'scatter',
      mode: "lines",
      name: 'Leverage Ratio',
      line: {color: '#17BECF'}
    };

  let data_hisTrend = [trace_liq, trace_lev];
  
  let layout = { 
  };

  let config = {responsive: true}
  
  Plotly.newPlot('hisTrend', data_hisTrend, layout, config);

  // Render asset composition charts
  let data_assetComp = [{
    type: 'funnel', 
    y: ["Total Asset", "LA and HQLA", "HQLA"], 
    x: [13873, 2703, 908], 
    hoverinfo: 'x+percent previous+percent initial',
    marker: {color: ["59D4E8", "DDB6C6", "94D2E6"]}
  }];

  let layout_assetComp = {      
    xaxis: {
      tickfont: {family: "Lato"}
    },
    // autosize: true,
    showlegend: false
    }

  // let config = {responsive: true}

  Plotly.newPlot('assetComp', data_assetComp, layout_assetComp, config);
  
// Render liquidity impact chart
liqImpact = document.getElementById('liqImpact');

let data_liq = [
    {
        name: "liquidity surplus",
        type: "waterfall",
        orientation: "v",
        measure: [
            "relative",
            "relative",
            "relative",
            "relative",
            "total"
        ],
        x: [
            "Starting Surplus",
            "HQLA",
            "LA",
            "Cash Outflow",
            "Ending Surplus"
        ],
        textposition: "inside",
        text: [
            "+60",
            "+80",
            "-40",
            "-20",
            "+80"
        ],          
        y: [
            60,
            80,
            -40,
            -20,
            0
        ],
        connector: {
          line: {
            color: "rgba(255, 209, 0, 0.2)"
          }
        },
        decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
        increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
        totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}}
      }
  ];
  let layout_liq = {
      title: {
          text: "<b>Liquidity Surplus Impact</b>",
          tickfont: {family: "Lato"},
          titleposition: "top left",
          xanchor: "right",
          yanchor: "top",
          x: 0.55,
          y: 0.98
      },
      xaxis: {
          tickfont: {family: "Lato"},
          type: "category"
      },
      yaxis: {
          tickfont: {family: "Lato"},
          type: "linear",
          showgrid: false,
          zeroline: true,
          showline: false,
          showticklabels: false
      },
      margin: {
        l: 10,
        r: 35,
        b: 70,
        t: 30,
        pad: 0
      },
      // autosize: true,
      showlegend: false
  };

  // let config = {responsive: true}

  Plotly.newPlot('liqImpact', data_liq, layout_liq, config);

// Render leverage impact chart
levImpact = document.getElementById('levImpact');

let data_lev = [
    {
        name: "leverage",
        type: "waterfall",
        orientation: "v",
        measure: [
            "relative",
            "relative",
            "relative",
            "relative",
            "total"
        ],
        x: [
            "Starting Leverage",
            "Secured Debt",
            "Unsecured Debt",
            "Synthetics",
            "Ending Leverage"
        ],
        textposition: "inside",
        text: [
            "+30",
            "-20",
            "+40",
            "-20",
            "+30"
        ],          
        y: [
            30,
            -20,
            +40,
            -20,
            0
        ],
        connector: {
          line: {
            color: "rgba(255, 209, 0, 0.2)"
          }
        },
        decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
        increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
        totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}}
      }
  ];
  let layout_lev = {
      title: {
          text: "<b>Leverage Impact</b>",
          tickfont: {family: "Lato"},
          titleposition: "top left",
          xanchor: "right",
          yanchor: "top",
          x: 0.40,
          y: 0.98
      },
      xaxis: {
          tickfont: {family: "Lato"},
          type: "category"
      },
      yaxis: {
          tickfont: {family: "Lato"},
          type: "linear",
          showgrid: false,
          zeroline: true,
          showline: false,
          showticklabels: false
      },
      margin: {
        l: 10,
        r: 35,
        b: 70,
        t: 30,
        pad: 0
      },
      // autosize: true,
      showlegend: false
  };

  // let config = {responsive: true}

  Plotly.newPlot('levImpact', data_lev, layout_lev, config);


  // Make sure chart dimension covers article container as chart has its own aspect ratios
  // let grid_cell = document.getElementsByClassName('grid-cell');
  // let grid_group = document.getElementsByClassName('grid-group');
  
  // console.log(grid_cell[0].offsetWidth)
  // console.log(grid_group[0].offsetWidth)
  // console.log(grid_group.length)
  // for (var i=0; i < grid_group.length; i++) {
  //   grid_cell[i].setAttribute("style",`width:${grid_group[i].offsetWidth}px`);
  // }
  // console.log(grid_cell[0].offsetWidth)
  // console.log(grid_group[0].offsetWidth)
  // console.log(grid_group.length)

  // Render leverage impact chart
  trade_form = document.getElementById('trade-form');



});

// Function to create a new trade
// function create_trade() {

//   // Show the all posts view and hide other views
//   document.querySelector('#profile-view').style.display = 'none';
//   document.querySelector('#allposts-view').style.display = 'block';
//   document.querySelector('#following-view').style.display = 'none';

//   // Retrieve post information while setting fixed variables as const
//   var content = document.querySelector('#post_content').value;
  
//   // Create post information
//   fetch('/create_post', {
//     method: 'POST',
//     // Send Django CSRF Token
//     headers:{
//       'X-CSRFToken': getCookie('csrftoken')
//     },
//     body: JSON.stringify({
//         content: content
//     })
//   })
//   .then(response => response.json())
//   .then(result => {
//      // Print result
//      console.log(result);
//    });
//    // Reset value of the form
//    document.querySelector('#post_content').value = '';
//    // Pause for 200 milisecond to ensure post is updated before loading
//    sleep(200);
//    return true;
// }