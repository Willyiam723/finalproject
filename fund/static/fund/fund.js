// // Function for event-driven functions to execute once all DOM contents are loaded
// document.addEventListener('DOMContentLoaded', function() {
//   // Listen to clicks for submitting new posts when it's available
//   if (document.querySelector('#content')) {
//     document.querySelector('#content').addEventListener('click', () => create_post());
//   }
//   // Listen to clicks for following link when it's available
//   if (document.querySelector('#following')) {
//       document.querySelector('#following').addEventListener('click', () => load_following_posts(filter = "following", page=1));
//   }  
//   // By default, load all posts
//   load_posts(filter=0, page=1);
// });

// const Dropzone = require("./dropzone");

// // Function to create a new post
// function create_post() {

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

// // Function to load all posts
// function load_posts(filter, page) {
  
//   // Show the all posts view and hide other views
//   document.querySelector('#profile-view').style.display = 'none';
//   document.querySelector('#allposts-view').style.display = 'block';
//   document.querySelector('#following-view').style.display = 'none';

//   // Get posts information
//   fetch(`posts/${filter}/${page}`)
//   .then(response => response.json())
//   .then(response => {
//     pagination(filter, page, response.num_pages);
//     console.log(response.posts);
//     // Display posts
//     response.posts.forEach(post => display_post(post));
//   });

// }

// // Function to load filtered posts while avoid having prpfile-view to be hidden
// function load_filtered_posts(filter, page) {
  
//   // Get posts information
//   fetch(`posts/${filter}/${page}`)
//   .then(response => response.json())
//   .then(response => {
//     pagination(filter, page, response.num_pages);
//     console.log(response.posts);
//     // Display posts
//     response.posts.forEach(post => display_post(post));
//     });
// }

// // Function to load following posts
// function load_following_posts(filter, page) {
  
//   // Show the following view and hide other views
//   document.querySelector('#profile-view').style.display = 'none';
//   document.querySelector('#allposts-view').style.display = 'none';
//   document.querySelector('#following-view').style.display = 'block';

//   // Reset the contents of following-view to blank
//   document.getElementById('following-view').innerHTML = '';
  
//   // Get following posts information
//   fetch(`/following_posts/${page}`)
//   .then(response => response.json())
//   .then(response => {
//     pagination(filter, page, response.num_pages);
//     console.log(response.posts);
//     // Display posts
//     response.posts.forEach(post => display_post(post));
//   });
// }

// // Function to display pagination feature
// function pagination(filter, page, num_pages) {
  
//   // Create pagination wrapper
//   const pagination = document.createElement('ul');
//   pagination.className = "pagination";
//   pagination.innerHTML = "";
//   document.getElementById("allposts").innerHTML = "";

//   // Previous and page 1 button
//   const previous = document.createElement('li');
//   // Only enable previous page icon when current page is not 1
//   if (page === 1) {
//     previous.className = "page-item disabled";
//   }
//   else {
//     previous.className = "page-item";
//     if (filter === "following") {
//       previous.addEventListener('click', () => load_following_posts(filter, page-1));
//     }
//     else {
//       previous.addEventListener('click', () => load_filtered_posts(filter, page-1));
//     }
//   }
//   // Create link to navigate pages
//   const prev_anchor = document.createElement('a');
//   prev_anchor.className = "page-link";
//   prev_anchor.innerHTML = "Previous";
//   prev_anchor.href = "#";
//   previous.append(prev_anchor);
//   pagination.append(previous);

//   // Pages in the middle
//   // Loop through middle pages for navigation
//   for (let page_item=1; page_item<=num_pages; page_item++) {
//     const middle = document.createElement('li');
//     if (page_item === page) {
//       middle.className = "page-item active";
//     }
//     else {
//       middle.className = "page-item";
//       if (filter === "following") {
//         middle.addEventListener('click', () => load_following_posts(filter, page_item));
//       }
//       else {
//         middle.addEventListener('click', () => load_filtered_posts(filter, page_item));
//       }
//     }
//     // Create link to navigate pages
//     const mid_anchor = document.createElement('a');
//     mid_anchor.className = "page-link";
//     mid_anchor.innerHTML = page_item;
//     mid_anchor.href = "#";
//     middle.append(mid_anchor);
//     pagination.append(middle);
//   }

//   // Last and page max button
//   const next = document.createElement('li');
//   // Only enable last page icon when current page is not the maximum page
//   if (page === num_pages) {
//     next.className = "page-item disabled";
//   }
//   else {
//     next.className = "page-item";
//     if (filter === "following") {
//       next.addEventListener('click', () => load_following_posts(filter, page+1));
//     }
//     else {
//       next.addEventListener('click', () => load_filtered_posts(filter, page+1));
//     }
//   }
//   // Create link to navigate pages
//   const next_anchor = document.createElement('a');
//   next_anchor.className = "page-link";
//   next_anchor.innerHTML = "Next";
//   next_anchor.href = "#";
//   next.append(next_anchor);
//   pagination.append(next);

//   // Append pagination wrapper to different views
//   if (filter === 0) {
//     document.querySelector('#allposts').append(pagination);
//   }
//   else if (filter === "following") {
//     document.querySelector('#following-view').append(pagination);
//   }
//   else {
//     document.querySelector('#profile-view').append(pagination);
//   }
// };

// // Function to display all posts
// function display_post(post) {
  
//   // Create a wrapping div to append all displaying elements
//   const post_block = document.createElement('div');
//   post_block.className = "post_block";
  
//   // Display user name of the post
//   const user_name = document.createElement('div');
//   user_name.className = "user_name";
//   user_name.innerHTML = post.username;
//   post_block.append(user_name);
  
//   // Display content of the post
//   const content = document.createElement('div');
//   content.id = `${post.id}_post_content`;
//   content.className = "post_content";
//   content.innerHTML = post.content;
//   post_block.append(content);
  
//   // Display creation date time of the post
//   const date_time = document.createElement('div');
//   date_time.className = "date_time";
//   const format_timestamp = format_datetime(new Date(post.date_time));
//   date_time.innerHTML = format_timestamp;
//   post_block.append(date_time);
  
//   // Display number of likes of the post
//   const num_like = document.createElement('div');
//   num_like.className = "num_like";
//   num_like.id = `${post.id}_num_like`;
//   num_like.innerHTML = post.num_like;
//   post_block.append(num_like);

//   // Create like icon for post
//   const heart = document.createElement('img');
//   heart.className = "heart hvr-grow";
//   heart.id = `${post.id}_heart`;
//   heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Heart_icon_red_hollow.svg/812px-Heart_icon_red_hollow.svg.png";
//   post_block.append(heart);

//   // Make sure user is eligible to like a post
//   if (post.eligible_like) { 
//     // Then check if user is already liking the post to display the right heart icon
//     if (post.already_like) {
//       heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png";
//     }
//     // Run like or unlike function once heart icon is clicked
//     heart.addEventListener('click', () => like_unlike(post));
//   }
//   // If user is not eligible to like a post then hike the heart icon
//   else {
//     heart.style.display = 'none';
//   }

//   // Create edit link for user's post only
//   if (document.getElementById('username')){
//     // Check if the post is belong to logged in user
//     if (post.username === document.getElementById('username').innerHTML) {
//       const edit = document.createElement('a');
//       edit.className = "edit";
//       edit.id = `${post.id}_edit`
//       edit.innerHTML = "Edit";
//       // Enable user to click on the edit link to see edit post
//       edit.addEventListener('click', () => edit_post(post));
//       post_block.append(edit);
//     }
//   }

//   // Enable user to click on a user name to see profile page
//   user_name.addEventListener('click', () => display_profilepage(post.userid, post.username));

//   // Append wrapper to the appropriate views
//   if (filter === 0) {
//     document.querySelector('#allposts').append(post_block);
//   }
//   else if (filter === "following") {
//     document.querySelector('#following-view').append(post_block);
//   }
//   else {
//     document.querySelector('#profile-view').append(post_block);
//   }
// }

// // Function to allow user to edit his/her own posts
// function edit_post(post) {
//   // Get children belong to the post user has chose to edit
//   const old_content = document.getElementById(`${post.id}_post_content`);
//   const edit = document.getElementById(`${post.id}_edit`);
//   const post_block = old_content.parentNode;
  
//   // Hide the original content and edit icon
//   old_content.style.display = "none";
//   edit.style.display = "none";
  
//   // Create editable text area
//   const update_content = document.createElement('textarea');
//   update_content.innerHTML = old_content.innerHTML;

//   // Create save link
//   const save = document.createElement('a');
//   save.className = "save";
//   save.innerHTML = "save";

//   // Create cancel link
//   const cancel = document.createElement('a');
//   cancel.className = "cancel";
//   cancel.innerHTML = "cancel";

//   // Append the new text area, save icon and cancel icon to the post
//   post_block.insertBefore(update_content, post_block.children[2]);
//   post_block.insertBefore(save, post_block.children[3]);
//   post_block.insertBefore(cancel, post_block.children[4]);

//   // Update the post content
//   save.addEventListener('click', () => {
//     fetch('/create_post', {
//       method: 'PUT',
//       // Send Django CSRF Token
//       headers:{
//         'X-CSRFToken': getCookie('csrftoken')
//       },
//       body: JSON.stringify({
//           id: post.id,
//           content: update_content.value
//       })
//     })
//     .then(response => response.json())
//     .then(result => {
//        // Print result
//        console.log(result);
//     });

//     // Remove the new items after saving the post
//     update_content.remove();
//     save.remove();
//     cancel.remove();
//     old_content.innerHTML = update_content.value;
//     // Unhide the original content and edit icon
//     old_content.style.display = "block";
//     edit.style.display = "block";
//   })
//   // Remove the new items after cancelling the editing
//   cancel.addEventListener('click', () => {
//     update_content.remove();
//     save.remove();
//     cancel.remove();
//     // Unhide the original content and edit icon
//     old_content.style.display = "block";
//     edit.style.display = "block";
//   })


// }

// // Function to display profile page
// function display_profilepage(userid, username) {
  
//   // Show the profile page and hide other views
//   document.querySelector('#profile-view').style.display = 'block';
//   document.querySelector('#allposts-view').style.display = 'none';
//   document.querySelector('#following-view').style.display = 'none';

//   // Reset the contents of following-view to blank
//   document.getElementById('profile-view').innerHTML = '';

//   // Query to pull profile contents: profile name, follower num, following num, status of follow/unfollow
//   fetch(`/profile/${userid}`)
//   .then(response => response.json())
//   .then(profile => {
//       // Print follow profile
//       console.log(profile);

//       // Display profile name
//       const profile_name = document.createElement('h1');
//       profile_name.id = "profile_name";
//       profile_name.innerHTML = `Profile Name: ${profile.profile_username}`;
//       document.getElementById('profile-view').append(profile_name);

//       // Display follower number
//       const num_followers = document.createElement('div');
//       num_followers.id = `${profile.id}_num_followers`;
//       num_followers.innerHTML = `Followers: ${profile.followers}`;
//       document.getElementById('profile-view').append(num_followers);
      
//       // Display following number
//       const num_following = document.createElement('div');
//       num_following.id = "num_following";
//       num_following.innerHTML = `Followings: ${profile.following}`;
//       document.getElementById('profile-view').append(num_following);

//       // Display following button
//       const follow_button = document.createElement('button');
//       follow_button.className = "btn btn-primary hvr-grow";
//       follow_button.id = "follow_button";
//       document.getElementById('profile-view').append(follow_button);

//       // First check if profile is eligible to be followed by the user
//       if (profile.eligible_following) { 
//         // Then check if user is already following the profile to display the right follow button
//         if (profile.already_following) {
//           document.getElementById('follow_button').innerHTML = "Unfollow";
//         } 
//         else {
//           document.getElementById('follow_button').innerHTML = "Follow";
//         }

//         // Add DOMContentLoaded to prevent button automatically been clicked before done loading
//         document.addEventListener('DOMContentLoaded', function() {
//           // Run follow or unfollow function once follow button is clicked
//           document.querySelector('#follow_button').addEventListener('click', () => follow_unfollow(userid, username));
//         });
//       }
//       // Hide follow button if user is not eligible to follow the profile user
//       else {
//         document.querySelector('#follow_button').style.display = 'none';
//       }

//       // Run follow or unfollow function once follow button is clicked
//       document.querySelector('#follow_button').addEventListener('click', () => follow_unfollow(userid, username));
//       // Get posts made by user
//       load_filtered_posts(filter=userid, 1);
//   });
// }

// // Function to follow or unfollow a user
// function follow_unfollow(userid, username) {
  
//   // Create follow or unfollow information
//   fetch('/follow', {
//     method: 'POST',
//     // Send Django CSRF Token
//     headers:{
//       'X-CSRFToken': getCookie('csrftoken')
//     },
//     body: JSON.stringify({
//         follow_id: userid,
//     })
//   })
//   .then(response => response.json())
//   .then(result => {
//     // Print result
//     console.log(result);
//     // Update the display of follow button
//     const follow_button = document.getElementById('follow_button');
//     if (result.already_following) {
//     follow_button.innerHTML = "Unfollow";
//     } else {
//     follow_button.innerHTML = "Follow";
//     }
//     // Update the number of followers
//     const num_followers = document.getElementById(`${result.id}_num_followers`);
//     num_followers.innerHTML = `Followers: ${result.followers}`;
//    });
// }

// // Function to like or unlike a post
// function like_unlike(post) {
  
//   // Create follow or unfollow information
//   fetch('/like', {
//     method: 'POST',
//     // Send Django CSRF Token
//     headers:{
//       'X-CSRFToken': getCookie('csrftoken')
//     },
//     body: JSON.stringify({
//         post_id: post.id,
//     })
//   })
//   .then(response => response.json())
//   .then(result => {
//     // Print result
//     console.log(result);
//     // Update the heart icon
//     const heart = document.getElementById(`${result.id}_heart`);
//     if (result.already_like) {
//     heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png";
//     } else {
//     heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Heart_icon_red_hollow.svg/812px-Heart_icon_red_hollow.svg.png";
//     }
//     // Update the number of likes
//     const num_like = document.getElementById(`${result.id}_num_like`);
//     num_like.innerHTML = result.num_like;
//   });
// }

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

  // Contents to be rendered when Scenarios html is requested
  if (document.querySelector('#scenarios-view')) {
    
    // Increase a trade form when user request
    let add_form = document.querySelector('#add_form');
    let num_forms = document.getElementsByTagName('aside');
    let scenarios = document.querySelector('#scenarios');
    let postid = "";

    if (window.location.href.includes("?")) {
      let split_str_0 = window.location.href.split('?')[0];
      let split_str_1 = window.location.href.split('?')[1];
      add_form.href = split_str_0 + `?add=${num_forms.length}`;
      add_form.href = add_form.href + `&${split_str_1}`;
    }
    else {
      add_form.href = window.location.href + `?add=${num_forms.length}`;
    }
    
    postid = Number(window.location.href.split('postid=')[1]);
    if (isNaN(postid )) {
      postid = "";
    }

    if (document.querySelector('#post-id')) {
      postid = document.getElementById('#post-id').innerHTML;
      scenarios.innerHTML = `?postid=${postid}`;
      add_form.href = `?add=${num_forms.length}&postid=${postid}`;
    }

    if ((window.location.href.includes("postid=")) & (!window.location.href.includes("#"))) {
      let remove_button = document.getElementsByClassName("btn btn-sm btn-warning");
      let trade_ids = document.getElementsByClassName("extrades");
      let form = document.getElementById("form");
      form.action = `?postid=${postid}`;
      console.log(trade_ids);
      remove_button.innerHTML = "Remove from Post";
      for (let i=0; i < remove_button.length; i++) {
        remove_button[i].innerHTML = "Remove from Post";
        remove_button[i].href = `remove_from_post/${postid}/${trade_ids[i].innerHTML}`;
        console.log(trade_ids[i]);
      }
      let delete_all_button = document.getElementById('delete-all-button');
      delete_all_button.innerHTML = "Clear all from Post";
      delete_all_button.href = `clear_all_from_post/${postid}`;

      // let publish_post = document.getElementById('publish-post');
      // publish_post.hidden = false;

      let post_user = document.getElementById('post_user');
      post_user.hidden = false;

    }

    // console.log(postid);

    // Get posts information
    fetch(`charts/${postid}`)
    .then(response => response.json())
    .then(response => {
      console.log(response);

      // Render historical liquidity and leverage charts
      let li = response.liquidity
      let le = response.leverage
      let tr_hqla = 0
      let tr_la = 0
      let tr_ila = 0
      let tr_sd = 0
      let tr_unsd = 0
      let tr_syn = 0
      // Pull info on trade impact
      // for (let trade=1; trade<=num_pages; page_item++)
      // response.posts.forEach(post => display_post(post));
      response.trades.forEach(trade => trade_impact(trade));

      function trade_impact(trade) {
        if (trade.security === "HQLA") {
          tr_hqla += trade.amount;
          // li.hqla += tr_hqla;
        }
        if (trade.security === "LA") {
          tr_la += trade.amount;
          // li.la += tr_la;
        }
        if (trade.security === "ILA") {
          tr_ila += trade.amount;
          // li.ila += tr_ila;
        }
        if (trade.security === "Secured Debt") {
          tr_sd += trade.amount;
          // le.secured_debt += tr_sd;
        }
        if (trade.security === "Unsecured Debt") {
          tr_unsd += trade.amount;
          // le.unsecured_debt += tr_unsd;
        }
        if (trade.security === "Synthetics") {
          tr_syn += trade.amount;
          // le.synthetics += tr_syn;
        }
      }

      const lmt_liq_y = 1.2;
      const lmt_lev_y = 0.5;
      const root = document.querySelector(':root');
      const his_chart = document.getElementById('hisTrend');
      let tot_a = li.hqla + li.la + li.ila + tr_hqla + tr_la + tr_ila
      let liq_a = li.hqla + li.la + tr_hqla + tr_la
      let tot_l_start = le.secured_debt + le.unsecured_debt + le.synthetics
      let tot_l = le.secured_debt + le.unsecured_debt + le.synthetics + tr_sd + tr_unsd + tr_syn
      let liq_ratio = (liq_a)/li.cash_outflow;
      let lev_ratio = (tot_l)/tot_a;

      let trace_liq = {
          x: ['2021-02-01 00:00:00', '2021-03-01 00:00:00', '2021-04-01 00:00:00', '2021-05-01 00:00:00', Date.now()],
          y: [1.23, 1.34, 1.27, 1.5, liq_ratio],
          type: 'scatter',
          mode: "lines",
          name: 'Liquidity Ratio',
          line: {color: '#7F7F7F'}
        };

      let trace_lev = {
          x: ['2021-02-01 00:00:00', '2021-03-01 00:00:00', '2021-04-01 00:00:00', '2021-05-01 00:00:00', Date.now()],
          y: [0.26, 0.25, 0.23, 0.3, lev_ratio],
          type: 'scatter',
          mode: "lines",
          name: 'Leverage Ratio',
          line: {color: '#17BECF'}
        };

        let lmt_liq = {
          x: ['2021-02-01 00:00:00', '2021-03-01 00:00:00', '2021-04-01 00:00:00', Date.now()],
          y: [lmt_liq_y, lmt_liq_y, lmt_liq_y, lmt_liq_y],
          mode: 'lines',
          name: 'Liquidity Limit',
          line: {
            dash: 'dashdot',
            width: 1,
            color: '#ec1848'
          }
        };

        let lmt_lev = {
          x: ['2021-02-01 00:00:00', '2021-03-01 00:00:00', '2021-04-01 00:00:00', Date.now()],
          y: [lmt_lev_y, lmt_lev_y, lmt_lev_y, lmt_lev_y],
          mode: 'lines',
          name: 'Leverage Limit',
          line: {
            dash: 'dashdot',
            width: 1,
            color: '#c6ec1d'
          }
        };

      let data_hisTrend = [trace_liq, lmt_liq, trace_lev, lmt_lev];
      
      let layout = { 
        margin: {
          l: 35,
          r: 35,
          b: 70,
          t: 30,
          pad: 0
        },
        autosize: true
      };

      let config = {responsive: true, displayModeBar: false}
      
      Plotly.newPlot('hisTrend', data_hisTrend, layout, config);

      // Animation - send alert and set background color to warning if trades cause breaching the limit
      if (liq_ratio < lmt_liq_y) {
        alert("Caution: Fund liquidity limits have been breached!");
        root.style.setProperty('--page-content-bgColor', '#f44336');
        his_chart.style.animation = 'shake 0.5s 5';
      }
      else if (lev_ratio > lmt_lev_y) {
        alert("Caution: Fund leverage limits have been breached!");
        root.style.setProperty('--page-content-bgColor', '#f44336');
        his_chart.style.animation = 'shake 0.5s 5';
      }
      else {
        root.style.setProperty('--page-content-bgColor', '#f0f1f6');
      }

      // Render asset composition charts
      let data_assetComp = [{
        type: 'funnel', 
        y: ["Total Asset", "LA and HQLA", "HQLA"], 
        x: [tot_a, liq_a, li.hqla + tr_hqla], 
        hoverinfo: 'x+percent previous+percent initial',
        marker: {color: ["59D4E8", "DDB6C6", "94D2E6"]}
      }];

      let layout_assetComp = {      
        xaxis: {
          tickfont: {family: "Lato"}
        },
        margin: {
          l: 75,
          r: 35,
          b: 70,
          t: 30,
          pad: 0
        },
        autosize: true,
        showlegend: false
        }

      Plotly.newPlot('assetComp', data_assetComp, layout_assetComp, config);
      
      // let modebar = document.getElementsByClassName('modebar');
      // for (let i=0; i<modebar.length; i++){
      //   modebar[i].remove();
      // }
      // console.log(modebar);

      // Render liquidity impact chart
      liqImpact = document.getElementById('liqImpact');

      // Make numbers of columns flexible so that a column is hident if change column is zero
      // let box = "";
      // if (tr_hqla === 0) {
      // box = `x: ["Starting Surplus",
      //     "HQLA",
      //     "LA",
      //     "Cash Outflow",
      //     "Ending Surplus"
      // ],
      // text: [
      //     `${li.surplus}`,
      //     `${tr_hqla}`,
      //     `${tr_la}`,
      //     "-200",
      //     `${li.surplus + tr_hqla + tr_la}`
      // ],          
      // y: [
      //     li.surplus,
      //     tr_hqla,
      //     tr_la,
      //     -200,
      //     li.surplus + tr_hqla + tr_la
      // ],`
      // }
      let data_liq = []

      // Assume cashoutflow is 200
      let tr_cof = -200
      
      if ((tr_hqla === 0) & (tr_la === 0)) {
        data_liq = [
          {
              name: "liquidity surplus",
              type: "waterfall",
              orientation: "v",
              textposition: "outside",
              measure: [
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Surplus",
                  "Cash Outflow",
                  "Ending Surplus"
              ],
              text: [
                  `${li.surplus}`,
                  `${tr_cof}`,
                  `${li.surplus + tr_hqla + tr_la + tr_cof}`
              ],          
              y: [
                  li.surplus,
                  tr_cof,
                  li.surplus + tr_hqla + tr_la
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
          }
        ];
      }
      else if (tr_hqla === 0) {
        data_liq = [
          {
              name: "liquidity surplus",
              type: "waterfall",
              orientation: "v",
              textposition: "outside",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Surplus",
                  "LA",
                  "Cash Outflow",
                  "Ending Surplus"
              ],
              text: [
                  `${li.surplus}`,
                  `${tr_la}`,
                  `${tr_cof}`,
                  `${li.surplus + tr_hqla + tr_la + tr_cof}`
              ],          
              y: [
                  li.surplus,
                  tr_la,
                  tr_cof,
                  li.surplus + tr_hqla + tr_la
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
          }
        ];
      }
      else if (tr_la === 0) {
        data_liq = [
          {
              name: "liquidity surplus",
              type: "waterfall",
              orientation: "v",
              textposition: "outside",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Surplus",
                  "HQLA",
                  "Cash Outflow",
                  "Ending Surplus"
              ],
              text: [
                  `${li.surplus}`,
                  `${tr_hqla}`,
                  `${tr_cof}`,
                  `${li.surplus + tr_hqla + tr_la + tr_cof}`
              ],          
              y: [
                  li.surplus,
                  tr_hqla,
                  tr_cof,
                  li.surplus + tr_hqla + tr_la
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else {
        data_liq = [
          {
              name: "liquidity surplus",
              type: "waterfall",
              orientation: "v",
              textposition: "outside",
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
              text: [
                  `${li.surplus}`,
                  `${tr_hqla}`,
                  `${tr_la}`,
                  `${tr_cof}`,
                  `${li.surplus + tr_hqla + tr_la + tr_cof}`
              ],          
              y: [
                  li.surplus,
                  tr_hqla,
                  tr_la,
                  tr_cof,
                  li.surplus + tr_hqla + tr_la
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      
      let layout_liq = {
          title: {
              text: "<b>Liquidity Surplus Impact</b>",
              tickfont: {family: "Lato"},
              // titleposition: "top left",
              // xanchor: "right",
              // yanchor: "top",
              // x: 0.55,
              // y: 0.98
          },
          xaxis: {
              tickfont: {family: "Lato"},
              type: "category",
              automargin: true
          },
          yaxis: {
              tickfont: {family: "Lato"},
              type: "linear",
              showgrid: false,
              zeroline: true,
              showline: false,
              showticklabels: false,
              automargin: true
          },
          margin: {
            l: 10,
            r: 35,
            b: 70,
            t: 30,
            pad: 0
          },
          autosize: true,
          showlegend: false
      };

      Plotly.newPlot('liqImpact', data_liq, layout_liq, config);

      // Render leverage impact chart
      levImpact = document.getElementById('levImpact');

      let data_lev = []

      // Make sure columns with no change are hidden
      if (tr_sd === 0 & tr_unsd === 0 & tr_syn === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tot_l
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_sd === 0 & tr_unsd === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Synthetics",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_syn}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_syn,
                  tot_l
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_sd === 0 & tr_syn === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Unsecured Debt",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_unsd}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_unsd,
                  tot_l
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_unsd === 0 & tr_syn ===0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Secured Debt",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_sd}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_sd,
                  tot_l
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_sd === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Unsecured Debt",
                  "Synthetics",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_unsd}`,
                `${tr_syn}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_unsd,
                  tr_syn,
                  tot_l
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_unsd === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Secured Debt",
                  "Synthetics",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_sd}`,
                `${tr_syn}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_sd,
                  tr_syn,
                  tot_l
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_syn === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Secured Debt",
                  "Unsecured Debt",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_sd}`,
                `${tr_unsd}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_sd,
                  tr_unsd,
                  tot_l
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else {
        data_lev = [
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
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_sd}`,
                `${tr_unsd}`,
                `${tr_syn}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_sd,
                  tr_unsd,
                  tr_syn,
                  tot_l
              ],
              // connectgaps=True,
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }

      let layout_lev = {
            title: {
                text: "<b>Leverage Impact</b>",
                tickfont: {family: "Lato"},
                // titleposition: "top left",
                // xanchor: "right",
                // yanchor: "top",
                // x: 0.40,
                // y: 0.98
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
            autosize: true,
            showlegend: false
        };

      Plotly.newPlot('levImpact', data_lev, layout_lev, config);

    });
    



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

    // Make sure user can't choose to buy debts
    let selects = document.getElementsByTagName('select');

    for(let i=0; i<selects.length; i++) {
          selects[i].onchange = function() {
            // console.log(selects[i].options[selects[i].selectedIndex].text)
            if(selects[i].options[selects[i].selectedIndex].text === 'Buy') {
              // console.log(1)  
              for(let j=0; j<selects[i+1].options.length; j++) {
                // console.log(2)
                  if((selects[i+1].options[j].text === 'Secured Debt') || (selects[i+1].options[j].text === 'Unsecured Debt') || (selects[i+1].options[j].text === 'Synthetics')) {
                    // console.log(3)
                    // console.log(selects[i+1].options[j].text);
                    selects[i+1].options[j].disabled = true;
                  }
              }
              
            }
            else if((selects[i].options[selects[i].selectedIndex].text === 'Secured Debt') || (selects[i].options[selects[i].selectedIndex].text === 'Unsecured Debt') || (selects[i].options[selects[i].selectedIndex].text === 'Synthetics')) {
              // console.log(1)  
              for(let j=0; j<selects[i-1].options.length; j++) {
                // console.log(2)
                  if(selects[i-1].options[j].text === 'Buy') {
                    // console.log(3)
                    // console.log(selects[i-1].options[j].text);
                    selects[i-1].options[j].disabled = true;
                  }
              }
              
            }
            else if ((selects[i].options[selects[i].selectedIndex].text === 'HQLA') || (selects[i].options[selects[i].selectedIndex].text === 'LA') || (selects[i].options[selects[i].selectedIndex].text === 'ILA') || (selects[i].options[selects[i].selectedIndex].text === '---------')) {
              for(let j=0; j<selects[i-1].options.length; j++) {
                // console.log(2)
                // console.log(selects[i-1].options[j].text);
                selects[i-1].options[j].disabled = false;
              }
            }
            else {
              for(let j=0; j<selects[i+1].options.length; j++) {
                  // console.log(2)
                  // console.log(selects[i+1].options[j].text);
                  selects[i+1].options[j].disabled = false;
              }
            }
          }
    }

    // Ensure buy amount offset sell amount in formset submitted
    let formset = document.getElementsByClassName('formset');

    // Build a div for warning message but hide it by default
    let message_text = "Please ensure Buy and Sell amount offset one another before submitting!"
    const button_wrapper = document.getElementById('button-wrapper');
    const submit_form = document.getElementById('submit-form');
    const message = document.createElement('div');
    message.className = "message";
    message.innerHTML = message_text;

    button_wrapper.appendChild(message);
    message.style.display = "none";

    // Make sure total Buy amount offsets total Sell amount
    for(let i=0; i<formset.length; i++) {
      formset[i].onchange = function() {
        let cum_amount = 0;
        console.log(formset[i].children[2].value);
        console.log(formset[i].children[6].value);
        for (let j=0; j<formset.length; j++) {
          if (formset[j].children[2].value === 'Buy') {
            cum_amount += Number(formset[j].children[6].value);
          }
          else if(formset[j].children[2].value === 'Sell') {
            cum_amount -= Number(formset[j].children[6].value);
          }
        }
        console.log(cum_amount)
        if (cum_amount !== 0) {
          console.log("Amounts must offset!")
          // Render the warning message
          message.style.display = "block";
          // Disable submit button
          submit_form.disabled = true;
          // Disappear on change
        }
        else if (cum_amount === 0) {
          // Hide the warning message
          message.style.display = "none";
          // Enable submit button
          submit_form.disabled = false;
        }
      }
    }

    // // Ensure buy amount offset sell amount in formset submitted
    // document.querySelector('#submit-form').addEventListener('click', () => check_amount_offsets())

    // function check_amount_offsets() {
    //   let formset = document.getElementsByClassName('formset');
    //   console.log(formset);
    // }

    // Run update post content function when user is the creator of the post
    let post_user = document.getElementById('post_user').innerHTML
    post_user = post_user.replace('Creator: ', '');
    let username = document.getElementById('username').innerHTML
    username = username.replace('Hello, ', '');

    // Only update post content and time stamp when save scenario button is clicked
    if (post_user === username) {
      document.querySelector('#save-post').addEventListener('click', () => update_post(postid));
      
      // Allow updating publish post only user is the creator of post
      let publish_post = document.getElementById('publish-post');
      publish_post.hidden = false;
    }
    // Otherwise create a new scenario post when save button is clicked
    else {
      document.querySelector('#save-post').addEventListener('click', () => create_post());
    }
    
    // Function to update post content and time stamp
    function update_post(postid) {

      // Retrieve post information
      let post_id = '';
      if (postid === '') {
        post_id = document.getElementById('post-id').innerHTML;
      }
      else {
        post_id = postid;
      }
      let scenario_content = document.getElementById('scenario_content').value;

      console.log(post_id);
      console.log(scenario_content);
      
      // Update post information
      fetch('/create_post', {
        method: 'PUT',
        // Send Django CSRF Token
        headers:{
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            post_id: post_id,
            scenario_content: scenario_content,
            publish_post: ""
        })
      })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
        // Reset value of the form
        // document.getElementById('publish-post').innerHTML = result.publish_post;

      });
    }
    
    // Function to create a new scenario post
    function create_post() {

      // Retrieve post information while setting fixed variables as const
      const extrades = document.getElementsByClassName('extrades');
      const content = document.getElementById('scenario_content').value;
      let trade_ids = []

      // Extract trade id from extrades
      for(let i=0; i<extrades.length; i++) {
        if (i === extrades.length - 1) {
          trade_ids += `${extrades[i].innerHTML}`;
        }
        else {
          trade_ids += `${extrades[i].innerHTML},`;
        }
      }

      trade_ids = trade_ids.split(',');
      
      // Create post information
      fetch('/create_post', {
        method: 'POST',
        // Send Django CSRF Token
        headers:{
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            trade_ids: trade_ids,
            content: content
        })
      })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
        // Reset value of the form
        // document.getElementById('scenario_content').value = '';
        let publish_post = document.getElementById('publish-post');
        if (result.post.publish) {
          publish_post.innerHTML = "Unpublish";
        }
        else {
          publish_post.innerHTML = "Publish";
        }
        publish_post.hidden = false;

        let save_post = document.getElementById('save-post');
        save_post.innerHTML = "Save Scenario Description";

        const post_id = document.createElement('div');
        post_id.id = "post-id";
        post_id.innerHTML = result.post.id;
        const button_wrapper_header = document.getElementById('button-wrapper-header');
        button_wrapper_header.append(post_id);
        post_id.style.display = "none";
      });
    }

    // Update a scenario post when publish button is clicked
    document.querySelector('#publish-post').addEventListener('click', () => publish_post(postid));
    
    // Function to update publishing
    function publish_post(postid) {

      // Retrieve post information
      let post_id = '';
      if (postid === '') {
        post_id = document.getElementById('post-id').innerHTML;
      }
      else {
        post_id = postid;
      }
      let publish_post = document.getElementById('publish-post').innerHTML;

      console.log(post_id);
      console.log(publish_post);
      
      // Update post information
      fetch('/create_post', {
        method: 'PUT',
        // Send Django CSRF Token
        headers:{
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            post_id: post_id,
            publish_post: publish_post,
            scenario_content: ""
        })
      })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
        // Reset value of the form
        document.getElementById('publish-post').innerHTML = result.publish_post;

      });
    }

    // Show alert box
    let alertbox = document.getElementById('alert-box');

    const handleAlerts = (type, message) => {
      alertbox.innerHTML = `<div class="alert alert-${type}" role="alert>${message}</div>`
    }


    // Send csv file to store in database
    Dropzone.autoDiscover = false;
    const myDropzone = new Dropzone('#my-dropzone', {
      url: 'upload/',
      init: function() {
        this.on('sending', function(file, xhr, formData){
          console.log('sending');
          formData.append('X-CSRFToken', getCookie('csrftoken'));
          formData.append('postid', postid);
        })
        this.on('success', function(file, response) {
          console.log(response.flag)
          if(response.flag) {
            alertbox.innerHTML = `${response.message}`;
            alertbox.className = "message-success";
          }
          else {
            alertbox.innerHTML = `${response.message}`
            alertbox.className = "message";
          }
          location.reload();
        })
      },
      maxFiles: 3,
      maxFilesize: 3,
      acceptedFiles: '.csv'
    })

  }

  // Function to display pagination feature
  function pagination(page, num_pages) {
      
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
      previous.addEventListener('click', () => load_posts(page-1));
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
        middle.addEventListener('click', () => load_posts(page_item));
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
      next.addEventListener('click', () => load_posts(page+1));
      }
    
    // Create link to navigate pages
    const next_anchor = document.createElement('a');
    next_anchor.className = "page-link";
    next_anchor.innerHTML = "Next";
    next_anchor.href = "#";
    next.append(next_anchor);
    pagination.append(next);

    // Append pagination wrapper to different views
    document.querySelector('#allposts').append(pagination);
  };

  // Function to display all posts
  function display_post(post, view) {
    
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

    // Display trade transaction of the post
    const num_trade = document.createElement('div');
    num_trade.className = "num_trade";
    num_trade.innerHTML = `Number of trades: ${post.num_trade}`;
    post_block.append(num_trade);

    // // Display trade security of the post
    // const trade_security = document.createElement('div');
    // trade_security.className = "trade_security";
    // trade_security.innerHTML = post.trade_security;
    // post_block.append(trade_security);

    // // Display trade amount of the post
    // const trade_amount = document.createElement('div');
    // trade_amount.className = "trade_amount";
    // trade_amount.innerHTML = post.trade_amount;
    // post_block.append(trade_amount);

    // Display publishing status of the post
    const publish = document.createElement('div');
    publish.id = `${post.id}_post_publish`;
    publish.className = "post_publish";
    if (post.publish === true) {
      publish.innerHTML = "Published"
    }
    else {
      publish.innerHTML = "Private"
    }
    post_block.append(publish);
    
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

    // Display anchor to get to the details in senarios page for the post
    const detail = document.createElement('a');
    detail.className = "detail";
    detail.id = `${post.id}_detail`;
    detail.innerHTML = "see Details & Edit >>>";
    detail.href = `?postid=${post.id}`;
    detail.href = detail.href.replace(`${view}`, '');
    // detail.href = `{% url 'namespace: scenarios' %}?postid=${post.id}`;
    post_block.append(detail);


    // detail.addEventListener('click', () => load_scenario(post));

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
        // edit.addEventListener('click', () => edit_post(post));
        post_block.append(edit);
      }
    }

    // Enable user to click on a user name to see profile page
    // user_name.addEventListener('click', () => display_profilepage(post.userid, post.username));

    // Append wrapper to the appropriate views
    // if (filter === 0) {
    document.querySelector('#allposts').append(post_block);
    // }
    // else if (filter === "following") {
    //   document.querySelector('#following-view').append(post_block);
    // }
    // else {
    //   document.querySelector('#profile-view').append(post_block);
    // }
  }

  // Function to like or unlike a post
  function like_unlike(post) {
    
    // Create like or unlike information
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

  // Contents to be rendered when Saved html is requested
  if (document.querySelector('#saved-view')) {
    // By default, load all posts
    load_posts(page=1);

    // Function to load all posts
    function load_posts(page) {
      
      // Show the all posts view and hide other views
      // document.querySelector('#profile-view').style.display = 'none';
      // document.querySelector('#allposts-view').style.display = 'block';
      // document.querySelector('#following-view').style.display = 'none';

      // Get posts information
      fetch(`posts/${page}`)
      .then(response => response.json())
      .then(response => {
        pagination(page, response.num_pages);
        console.log(response.posts);
        // Display posts
        response.posts.forEach(post => display_post(post, 'saved'));
      });
    }

    
  }
  // Contents to be rendered when Shared html is requested
  if (document.querySelector('#shared-view')) {
    // By default, load all posts
    load_posts_published(page=1);

    // Function to load all posts
    function load_posts_published(page) {
      
      // Show the all posts view and hide other views
      // document.querySelector('#profile-view').style.display = 'none';
      // document.querySelector('#allposts-view').style.display = 'block';
      // document.querySelector('#following-view').style.display = 'none';

      // Get posts information
      fetch(`posts_published/${page}`)
      .then(response => response.json())
      .then(response => {
        pagination(page, response.num_pages);
        console.log(response.posts);
        // Display posts
        response.posts.forEach(post => display_post(post, 'shared'));
      });
    }
  }
});
  // console.log(`${extrade}`);

//   for(let i=0; i<selects.length; i++) {
//     selects[i].onchange = function() {
//       console.log(selects[i].options[selects[i].selectedIndex].text)
//       if(selects[i].options[selects[i].selectedIndex].text === 'Buy') {
//         for(let j=0; j<selects.length; j++) {
//           for(let k=0; k<selects[j].options.length; k++) {
//             if((selects[j].options[k].text === 'Secured Debt') || (selects[j].options[k].text === 'Unsecured Debt') || (selects[j].options[k].text === 'Synthetics')) {
//               console.log(selects[j].options[k].text);
//               selects[j].options[k].disabled = true;
//             }
//           }
//         }
//       }
//       else {
//         for(let j=0; j<selects.length; j++) {
//           for(let k=0; k<selects[j].options.length; k++) {
//             if((selects[j].options[k].text === 'Secured Debt') || (selects[j].options[k].text === 'Unsecured Debt') || (selects[j].options[k].text === 'Synthetics')) {
//               console.log(selects[j].options[k].text);
//               selects[j].options[k].disabled = false;
//             }
//           }
//         }
//       }
//     }
// }
  // trade_form = document.getElementById('trade-form');





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