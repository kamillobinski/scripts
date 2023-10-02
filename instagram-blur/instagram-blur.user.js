// ==UserScript==
// @name         Instagram Privacy Blur
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blur all names and avatars!
// @author       softllu
// @match        https://www.instagram.com/direct/*
// @icon         https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png
// @grant        GM_addStyle
// ==/UserScript==

const BLUR_TYPE = {
    message: 'message'
};

(function () {
    'use strict';

    let errorOverlay = null;

    function blur(items, type) {
        switch (type) {
            case BLUR_TYPE.message: {
                items.forEach(item => {
                    if (!item.textContent.contains('Ty:')) {
                        item.style.filter = "blur(7px)";
                    }
                });
                break;
            }
            default: {
                items.forEach(item => {
                    item.style.filter = "blur(7px)";
                });
                break;
            }
        }
    }

    function mutationCallback(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const listNewConversationNames = findListNewConversationNames();
                const listNames = findListNames();
                const listAvatars = findListAvatars();
                const listMessageContents = findListMessageContents();
                const msgHeaders = findDirectMsgHeader();
                const msgProfileCards = findDirectMsgProfileCard();
                const msgMessageAvatars = findDirectMsgMessageAvatar();

                blurAll(listNewConversationNames, listNames, listAvatars, listMessageContents, msgHeaders, msgProfileCards, msgMessageAvatars);
            }
        }
    }

    function blurAll(listNewConversationNames, listNames, listAvatars, listMessageContents, msgHeaders, msgProfileCards, msgMessageAvatars) {
        const URL = window.location.pathname;

        blur(listNewConversationNames);
        blur(listNames);
        blur(listAvatars);
        blur(listMessageContents, BLUR_TYPE.message);
        blur(msgHeaders);
        blur(msgProfileCards);
        blur(msgMessageAvatars);

        if (URL.includes('/direct/inbox/')) {
            if (listNames.length === 0 || listAvatars.length === 0) {
                showError();
            } else {
                hideError();
            }
        }

        if (URL.includes("/direct/t/")) {
            if (listNames.length === 0 || listAvatars.length === 0 || msgHeaders.length === 0 || msgMessageAvatars === 0) {
                showError();
            } else {
                hideError();
            }
        }
    }

    function findListNewConversationNames() {
        return document.querySelectorAll(".x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.x1s688f.x5n08af.x1tu3fi.x3x7a5m.x10wh9bi.x1wdrske.x8viiok.x18hxmgj")
    }

    function findListNames() {
        return document.querySelectorAll(".x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x1tu3fi.x3x7a5m.x10wh9bi.x1wdrske.x8viiok.x18hxmgj");
    }

    function findListAvatars() {
        var listAvatars = document.querySelectorAll(".x78zum5.x2lah0s.xn6708d");

        if (listAvatars.length === 0) {
            listAvatars = findMobileListAvatars()
        }

        return listAvatars;
    }

    function findMobileListAvatars() {
        return document.querySelectorAll(".x9f619.x1n2onr6.x1ja2u2z.x1qjc9v5.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k.xeuugli");
    }

    function findListMessageContents() {
        return document.querySelectorAll(".x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x6s0dn4.x1oa3qoh.x1nhvcw1.xmix8c7.xh8yej3")
    }

    function findDirectMsgName() {
        return document.querySelectorAll(".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x193iq5w.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xsyo7zv.x16hj40l.x10b6aqq.x1yrsyyn");
    }

    function findDirectMsgHeader() {
        return document.querySelectorAll(".x9f619.x1n2onr6.x1ja2u2z.x78zum5.x1r8uery.x1iyjqo2.xs83m0k.xeuugli.x1qughib.x6s0dn4.xozqiw3.x1q0g3np.xykv574.xbmpl8g.x4cne27.xifccgj");
    }

    function findDirectMsgProfileCard() {
        return document.querySelectorAll(".x6s0dn4.x78zum5.xdt5ytf.x2b8uid");
    }

    function findDirectMsgMessageAvatar() {
        return document.querySelectorAll(".xuk3077.x78zum5.x2lah0s.x1fgtraw.xgd8bvy");
    }

    function showError() {
        if (!errorOverlay) {
            errorOverlay = document.createElement('div');
            errorOverlay.style.position = 'fixed';
            errorOverlay.style.top = '0';
            errorOverlay.style.left = '0';
            errorOverlay.style.width = '100%';
            errorOverlay.style.height = '100%';
            errorOverlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
            errorOverlay.style.backdropFilter = 'blur(20px)';
            errorOverlay.style.zIndex = '9999';
            errorOverlay.style.display = 'flex';
            errorOverlay.style.flexDirection = 'column';
            errorOverlay.style.alignItems = 'center';
            errorOverlay.style.justifyContent = 'center';

            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';
            container.style.textAlign = 'center';

            const loader = document.createElement('div');
            loader.innerHTML = '<div class="lds-ripple"><div></div><div></div></div>';
            loader.style.width = '50px';
            loader.style.height = '50px';

            const styleElement = document.createElement('style');
            styleElement.innerHTML = `
            .lds-ripple {
                display: inline-block;
                position: relative;
                width: 80px;
                height: 80px;
                margin-left: -20px;
            }
            .lds-ripple div {
                position: absolute;
                border: 4px solid #a970ff;
                opacity: 1;
                border-radius: 50%;
                animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
            }
            .lds-ripple div:nth-child(2) {
                animation-delay: -0.5s;
            }
            @keyframes lds-ripple {
                0% {
                    top: 36px;
                    left: 36px;
                    width: 0;
                    height: 0;
                    opacity: 0;
                }
                4.9% {
                    top: 36px;
                    left: 36px;
                    width: 0;
                    height: 0;
                    opacity: 0;
                }
                5% {
                    top: 36px;
                    left: 36px;
                    width: 0;
                    height: 0;
                    opacity: 1;
                }
                100% {
                    top: 0px;
                    left: 0px;
                    width: 72px;
                    height: 72px;
                    opacity: 0;
                }
            }`;

            const message = document.createElement('div');
            message.innerHTML = "Chowam awatary i nazwy użytkowników.<br/>Jeśli widzisz to przez dłuższy czas to znaczy<br/>że się wyjebało XD";
            message.style.fontSize = '18px';
            message.style.color = '#ffffff';
            message.style.lineHeight = '1.4';
            message.style.marginTop = '45px';
            message.style.marginBottom = '35px';
            message.style.fontWeight = '400';

            const disableButton = document.createElement('button');
            disableButton.innerText = 'WCHODZĘ';
            disableButton.style.fontSize = '18px';
            disableButton.style.backgroundColor = '#a970ff';
            disableButton.style.color = '#ffffff';
            disableButton.style.fontWeight = '500';
            disableButton.style.border = 'none';
            disableButton.style.cursor = 'pointer';
            disableButton.style.borderRadius = '5px';
            disableButton.style.padding = '10px';
            disableButton.addEventListener('click', function () {
                hideError();
            });

            container.appendChild(loader);
            container.appendChild(message);
            container.appendChild(disableButton);

            errorOverlay.appendChild(container);

            document.body.appendChild(errorOverlay);
            document.head.appendChild(styleElement);
        } else {
            errorOverlay.style.display = 'flex';
        }
    }

    function hideError() {
        if (errorOverlay) {
            errorOverlay.style.display = 'none';
        }
    }

    function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, {type: contentType});
    }

    const observer = new MutationObserver(mutationCallback);

    observer.observe(document.body, {childList: true, subtree: true});
})();