// Global Application Runtime States (Saves in sessionStorage to persist across page routing)
// Automatically initializes raw state on first run and clears completely when tab is closed.
if (!sessionStorage.getItem("socialVibeState")) {
    var initialState = {
        currentUserName: "Virendra Chaturvedi",
        followState: false,
        userCreatedPosts: [],
        
        // Runtime track storage for HTML Static Posts Like/Comments
        staticPostsState: {
            alex: { liked: false, comments: [] },
            sam: { liked: false, comments: [] }
        },
        
        // Persistent runtime profile media paths
        profileImages: {
            avatar: null,
            cover: null
        },

        // Peer Friend Static Profile Mock Database
        peerProfiles: {
            alex: {
                name: "Alex Jones",
                bio: "Frontend Engineer | Open Source Enthusiast | UI Artisan 🚀",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
                cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
                posts: "42", followers: "1.2k", following: "412"
            },
            sam: {
                name: "Sam Wilson",
                bio: "Product Designer & Visual Content Creator | Minimalist Explorer 🎨",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
                cover: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200",
                posts: "89", followers: "3.1k", following: "290"
            },
            jane: {
                name: "Jane Doe",
                bio: "Full Stack Web Architect | Technical Blogger | Coffee Lover ☕",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
                cover: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200",
                posts: "211", followers: "12.5k", following: "884"
            }
        },

        // Chat History Framework Databases
        chats: {
            jane: {
                name: "Jane Doe",
                avatarClass: "avatar default-av-3",
                history: [
                    { type: "incoming", text: "Hey! How is your new project going?" },
                    { type: "outgoing", text: "Going great! Just designing the frontend right now. 👍" },
                    { type: "incoming", text: "Awesome, can't wait to see the final functional app!" }
                ]
            },
            alex: {
                name: "Alex Jones",
                avatarClass: "avatar default-av-1",
                history: [
                    { type: "incoming", text: "Yo bro, you online?" },
                    { type: "outgoing", text: "Yeah Alex, tell me." },
                    { type: "incoming", text: "Sure, let's meet tomorrow." }
                ]
            },
            sam: {
                name: "Sam Wilson",
                avatarClass: "avatar default-av-2",
                history: [
                    { type: "incoming", text: "Did you check out my profile update?" },
                    { type: "outgoing", text: "Not yet Sam, let me look." },
                    { type: "incoming", text: "Check out my new post!" }
                ]
            }
        }
    };
    sessionStorage.setItem("socialVibeState", JSON.stringify(initialState));
}

// Global active wrapper linked directly to persistent session storage helper
window.appState = JSON.parse(sessionStorage.getItem("socialVibeState"));

// Helper function to commit state changes seamlessly
function saveStateToSession() {
    sessionStorage.setItem("socialVibeState", JSON.stringify(window.appState));
}

document.addEventListener("DOMContentLoaded", function() {
    
    var state = window.appState;

    // Helper utilities to sync runtime dynamic updates
    function updateStaticLikeUI(peerKey) {
        var postObj = state.staticPostsState[peerKey];
        var icon = document.getElementById("like-icon-" + peerKey);
        var txt = document.getElementById("like-text-" + peerKey);
        if(!icon || !txt) return;

        if(postObj.liked) {
            icon.className = "fa-solid fa-thumbs-up";
            icon.style.color = "blue";
            txt.style.color = "blue";
            txt.textContent = "Liked";
        } else {
            icon.className = "fa-regular fa-thumbs-up";
            icon.style.color = "";
            txt.style.color = "";
            txt.textContent = "Like";
        }
    }

    // ==========================================
    // DYNAMIC & STATIC HOME TIMELINE CONTROLLER
    // ==========================================
    var dynamicUserPostsWrapper = document.getElementById("dynamicUserPostsWrapper");
    var submitPostBtn = document.getElementById("submitPostBtn");
    var postInput = document.getElementById("postInput");

    function renderDynamicUserPosts() {
        if (!dynamicUserPostsWrapper) return;
        dynamicUserPostsWrapper.innerHTML = "";

        for (var i = 0; i < state.userCreatedPosts.length; i++) {
            var post = state.userCreatedPosts[i];
            
            var cHtml = "";
            for (var j = 0; j < post.comments.length; j++) {
                cHtml += '<div class="single-comment"><strong>' + post.comments[j].author + ':</strong> <span>' + post.comments[j].text + '</span></div>';
            }

            var card = document.createElement("div");
            card.className = "post-card";
            card.innerHTML = `
                <div class="post-user">
                    <div class="avatar ${post.avatar}"></div>
                    <div>
                        <h4>${post.author}</h4>
                        <small>${post.time}</small>
                    </div>
                </div>
                <p class="post-content">${post.content}</p>
                <div class="post-actions">
                    <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="toggleDynamicPostLike(${post.id})">
                        <i class="${post.liked ? 'fa-solid' : 'fa-regular'} fa-thumbs-up"></i> <span>${post.liked ? 'Liked' : 'Like'}</span>
                    </button>
                    <button class="action-btn" onclick="toggleDynamicCommentView(this)">
                        <i class="fa-regular fa-comment"></i> Comment
                    </button>
                </div>
                <div class="comments-section hidden">
                    <div class="comments-list">${cHtml}</div>
                    <div class="comment-input-box" style="margin-top: 10px;">
                        <input type="text" placeholder="Write a comment..." class="custom-comment-box-input">
                        <button class="btn-comment-send" onclick="submitDynamicComment(this, ${post.id})"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            `;
            dynamicUserPostsWrapper.appendChild(card);
        }
    }

    // Dynamic Element Actions Hooks
    window.toggleDynamicPostLike = function(id) {
        for(var i=0; i<state.userCreatedPosts.length; i++) {
            if(state.userCreatedPosts[i].id === id) {
                state.userCreatedPosts[i].liked = !state.userCreatedPosts[i].liked;
                break;
            }
        }
        saveStateToSession();
        renderDynamicUserPosts();
    };

    window.toggleDynamicCommentView = function(btn) {
        var section = btn.closest(".post-card").querySelector(".comments-section");
        section.classList.toggle("hidden");
    };

    window.submitDynamicComment = function(btn, id) {
        var input = btn.closest(".comment-input-box").querySelector(".custom-comment-box-input");
        var val = input.value.trim();
        if(val !== "") {
            for(var i=0; i<state.userCreatedPosts.length; i++) {
                if(state.userCreatedPosts[i].id === id) {
                    state.userCreatedPosts[i].comments.push({ author: state.currentUserName, text: val });
                    break;
                }
            }
            input.value = "";
            saveStateToSession();
            renderDynamicUserPosts();
        }
    };

    // --- STATIC POST RUNTIME LOGIC (ALEX & SAM) ---
    window.handleStaticPostLike = function(peerKey) {
        var postObj = state.staticPostsState[peerKey];
        postObj.liked = !postObj.liked;
        saveStateToSession();
        updateStaticLikeUI(peerKey);
    };

    window.toggleStaticCommentBox = function(peerKey) {
        var targetBox = document.getElementById("comment-box-" + peerKey);
        targetBox.classList.toggle("hidden");
    };

    window.submitStaticCommentAction = function(peerKey) {
        var input = document.getElementById("comment-input-" + peerKey);
        var val = input.value.trim();
        if(val !== "") {
            state.staticPostsState[peerKey].comments.push({ author: state.currentUserName, text: val });
            input.value = "";
            saveStateToSession();
            renderStaticCommentsUI(peerKey);
        }
    };

    function renderStaticCommentsUI(peerKey) {
        var container = document.getElementById("comments-list-" + peerKey);
        if(!container) return;
        container.innerHTML = "";
        var list = state.staticPostsState[peerKey].comments;
        for(var i=0; i<list.length; i++) {
            var row = document.createElement("div");
            row.className = "single-comment";
            row.innerHTML = "<strong>" + list[i].author + ":</strong> <span>" + list[i].text + "</span>";
            container.appendChild(row);
        }
    }

    if(document.getElementById("static-post-alex")) {
        updateStaticLikeUI("alex");
        updateStaticLikeUI("sam");
        renderStaticCommentsUI("alex");
        renderStaticCommentsUI("sam");
    }

    if (submitPostBtn && postInput) {
        submitPostBtn.addEventListener("click", function() {
            var val = postInput.value.trim();
            if (val === "") return;
            state.userCreatedPosts.unshift({
                id: Date.now(),
                author: state.currentUserName,
                avatar: "my-avatar-av",
                time: "Just now",
                content: val,
                liked: false,
                comments: []
            });
            postInput.value = "";
            saveStateToSession();
            renderDynamicUserPosts();
        });
    }
    renderDynamicUserPosts();

    // ==========================================
    // SIDEBAR DRAWER RUNTIME CHAT COMPONENTS
    // ==========================================
    var toggleChatBtn = document.getElementById("toggleChatBtn");
    var sidebarChat = document.getElementById("sidebarChat");
    if (toggleChatBtn && sidebarChat) {
        toggleChatBtn.addEventListener("click", function() {
            sidebarChat.classList.toggle("hidden");
        });
    }

    var sendBtn = document.getElementById("sendBtn");
    var msgInput = document.getElementById("msgInput");
    var chatContainer = document.getElementById("chatContainer");

    if (sendBtn && msgInput && chatContainer) {
        function renderSidebarChatPane() {
            chatContainer.innerHTML = "";
            var h = state.chats.jane.history;
            for (var i = 0; i < h.length; i++) {
                var b = document.createElement("div");
                b.className = "message " + h[i].type;
                b.innerHTML = "<p>" + h[i].text + "</p>";
                chatContainer.appendChild(b);
            }
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        renderSidebarChatPane();

        sendBtn.addEventListener("click", function() {
            var txt = msgInput.value.trim();
            if (txt !== "") {
                state.chats.jane.history.push({ type: "outgoing", text: txt });
                saveStateToSession();
                renderSidebarChatPane();
                msgInput.value = "";
            }
        });
    }

    // ==========================================
    // PRIMARY INBOX MESSAGES TAB PANEL SYSTEMS
    // ==========================================
    var fullChatContainer = document.getElementById("fullChatContainer");
    var activeChatName = document.getElementById("activeChatName");
    var activeChatAvatar = document.getElementById("activeChatAvatar");

    var linkJane = document.getElementById("user-link-jane");
    var linkAlex = document.getElementById("user-link-alex");
    var linkSam = document.getElementById("user-link-sam");

    window.activeUserThreadKey = window.activeUserThreadKey || "jane";

    function renderMainInboxChatPane(key) {
        if (!fullChatContainer) return;
        var chat = state.chats[key];
        activeChatName.textContent = chat.name;
        activeChatAvatar.className = chat.avatarClass;
        
        activeChatName.setAttribute("data-peer", key);
        activeChatAvatar.setAttribute("data-peer", key);
        activeChatName.className = "view-peer-profile";
        activeChatAvatar.classList.add("view-peer-profile");

        fullChatContainer.innerHTML = "";
        for (var i = 0; i < chat.history.length; i++) {
            var b = document.createElement("div");
            b.className = "message " + chat.history[i].type;
            b.innerHTML = "<p>" + chat.history[i].text + "</p>";
            fullChatContainer.appendChild(b);
        }
        fullChatContainer.scrollTop = fullChatContainer.scrollHeight;
        bindPeerProfileRoutingTriggers();
    }

    function syncLastMessageLabels() {
        var keys = ["jane", "alex", "sam"];
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var lbl = document.getElementById("last-msg-" + k);
            if (lbl && state.chats[k].history.length > 0) {
                var arr = state.chats[k].history;
                lbl.textContent = arr[arr.length - 1].text;
            }
        }
    }

    if (linkJane && linkAlex && linkSam) {
        renderMainInboxChatPane(window.activeUserThreadKey);
        syncLastMessageLabels();

        linkJane.addEventListener("click", function() { clearChatLinks(); linkJane.classList.add("active-user"); window.activeUserThreadKey = "jane"; renderMainInboxChatPane("jane"); });
        linkAlex.addEventListener("click", function() { clearChatLinks(); linkAlex.classList.add("active-user"); window.activeUserThreadKey = "alex"; renderMainInboxChatPane("alex"); });
        linkSam.addEventListener("click", function() { clearChatLinks(); linkSam.classList.add("active-user"); window.activeUserThreadKey = "sam"; renderMainInboxChatPane("sam"); });

        function clearChatLinks() {
            linkJane.classList.remove("active-user"); linkAlex.classList.remove("active-user"); linkSam.classList.remove("active-user");
        }

        var fullSendBtn = document.getElementById("fullSendBtn");
        var fullMsgInput = document.getElementById("fullMsgInput");

        if (fullSendBtn && fullMsgInput) {
            fullSendBtn.addEventListener("click", function() {
                var txt = fullMsgInput.value.trim();
                if (txt !== "") {
                    state.chats[window.activeUserThreadKey].history.push({ type: "outgoing", text: txt });
                    saveStateToSession();
                    renderMainInboxChatPane(window.activeUserThreadKey);
                    syncLastMessageLabels();
                    fullMsgInput.value = "";
                }
            });
        }
    }

    // ==========================================
    // RUNTIME PROFILE MEDIA STORAGE OPERATIONS
    // ==========================================
    var avatarDisplay = document.getElementById("avatarDisplay");
    var coverDisplay = document.getElementById("coverDisplay");
    var avatarInput = document.getElementById("avatarInput");
    var coverInput = document.getElementById("coverInput");

    if (avatarDisplay && state.profileImages.avatar) {
        avatarDisplay.src = state.profileImages.avatar;
    }
    if (coverDisplay && state.profileImages.cover) {
        coverDisplay.src = state.profileImages.cover;
    }

    if (document.getElementById("avatarTrigger") && avatarInput) {
        document.getElementById("avatarTrigger").addEventListener("click", function() { avatarInput.click(); });
        avatarInput.addEventListener("change", function(e) {
            var f = e.target.files[0];
            if(f) {
                var r = new FileReader();
                r.onload = function(evt) {
                    avatarDisplay.src = evt.target.result;
                    state.profileImages.avatar = evt.target.result;
                    saveStateToSession();
                };
                r.readAsDataURL(f);
            }
        });
    }

    if (document.getElementById("profileEditBtn") && coverInput) {
        document.getElementById("profileEditBtn").addEventListener("click", function() { coverInput.click(); });
        coverInput.addEventListener("change", function(e) {
            var f = e.target.files[0];
            if(f) {
                var r = new FileReader();
                r.onload = function(evt) {
                    coverDisplay.src = evt.target.result;
                    state.profileImages.cover = evt.target.result;
                    saveStateToSession();
                };
                r.readAsDataURL(f);
            }
        });
    }

    var tabBtnPosts = document.getElementById("tab-btn-posts");
    var tabBtnSaved = document.getElementById("tab-btn-saved");
    var tabBtnTagged = document.getElementById("tab-btn-tagged");
    var panelPosts = document.getElementById("panel-my-posts");
    var panelSaved = document.getElementById("panel-saved");
    var panelTagged = document.getElementById("panel-tagged");

    if (tabBtnPosts && tabBtnSaved && tabBtnTagged) {
        tabBtnPosts.addEventListener("click", function() { resetTabs(); tabBtnPosts.classList.add("active"); panelPosts.classList.remove("hidden"); });
        tabBtnSaved.addEventListener("click", function() { resetTabs(); tabBtnSaved.classList.add("active"); panelSaved.classList.remove("hidden"); });
        tabBtnTagged.addEventListener("click", function() { resetTabs(); tabBtnTagged.classList.add("active"); panelTagged.classList.remove("hidden"); });
        function resetTabs() {
            tabBtnPosts.classList.remove("active"); tabBtnSaved.classList.remove("active"); tabBtnTagged.classList.remove("active");
            panelPosts.classList.add("hidden"); panelSaved.classList.add("hidden"); panelTagged.classList.add("hidden");
        }
    }

    // ==========================================
    // DYNAMIC RUNTIME PEER PROFILE ROUTER
    // ==========================================
    function bindPeerProfileRoutingTriggers() {
        var nodes = document.querySelectorAll(".view-peer-profile");
        for(var i=0; i<nodes.length; i++) {
            nodes[i].onclick = function(e) {
                e.stopPropagation();
                var pKey = this.getAttribute("data-peer");
                if(pKey) {
                    window.location.href = "peer-profile.html?user=" + pKey;
                }
            };
        }
    }
    bindPeerProfileRoutingTriggers();

    if (window.location.pathname.indexOf("peer-profile.html") !== -1) {
        var params = new URLSearchParams(window.location.search);
        var targetUser = params.get("user") || "jane";
        var peer = state.peerProfiles[targetUser];
        if (peer) {
            document.getElementById("peerNameDisplay").textContent = peer.name;
            document.getElementById("peerBioDisplay").textContent = peer.bio;
            document.getElementById("peerAvatarDisplay").src = peer.avatar;
            document.getElementById("peerCoverDisplay").src = peer.cover;
            document.getElementById("peerPostsCount").innerHTML = "<strong>" + peer.posts + "</strong> Posts";
            document.getElementById("peerFollowersCount").innerHTML = "<strong>" + peer.followers + "</strong> Followers";
            document.getElementById("peerFollowingCount").innerHTML = "<strong>" + peer.following + "</strong> Following";
        }
    }

    // ==========================================
    // RUNTIME NOTIFICATION TOGGLE GRAPHICS
    // ==========================================
    var followToggleBtn = document.getElementById("followToggleBtn");
    if (followToggleBtn) {
        if (state.followState) {
            followToggleBtn.classList.add("following-state");
            followToggleBtn.textContent = "Following";
        }
        followToggleBtn.addEventListener("click", function() {
            state.followState = !state.followState;
            saveStateToSession();
            if (state.followState) {
                followToggleBtn.classList.add("following-state");
                followToggleBtn.textContent = "Following";
            } else {
                followToggleBtn.classList.remove("following-state");
                followToggleBtn.textContent = "Follow Back";
            }
        });
    }
});