/*
    General utility functions
    By Kristoffer Bengtsson
*/


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Set an event listener on the element(s) matching the targetIdentifier selector, if any exist.
// Return an array with all matching elements. 
export function setEventListener(targetSelector, eventType, eventCallback) {
    const eventTargets = document.querySelectorAll(targetSelector);
    const targetElements = [];
    if ((eventTargets !== undefined) && (eventTargets !== null)) {
        eventTargets.forEach((eventTarget) => {
            eventTarget.addEventListener(eventType, eventCallback);
            targetElements.push(eventTarget);
        });
    }
    return targetElements;
}


///////////////////////////////////////////////////////////////////////////////////////////
// Convert a timestamp number to a displayable date string using the formatting of the
// specified language locale (e.g. 'sv-SE', 'en-US' etc), or the browser language 
// if none is specified. 
export function timestampToDateTime(timestamp, isMilliSeconds = true, locale = null) {
    const dateObj = new Date(isMilliSeconds ? timestamp : timestamp * 1000);
    const formatLocale = (locale ?? navigator.language);
    const formatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    };

    return new Intl.DateTimeFormat(formatLocale, formatOptions).format(dateObj);
    // return `${dateObj.toLocaleDateString(formatLocale)} ${dateObj.toLocaleTimeString(formatLocale)}`;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Return a string cropped down to a maximum number of characters. The function will cut off the
// string at the closest space character before the max-length to avoid cutting in the middle of words.
export function getTruncatedString(truncText, maxLength) {
    if (maxLength < truncText.length) {
        let cutOffLength = truncText.lastIndexOf(" ", maxLength);
        if (cutOffLength < 1) {
            cutOffLength = maxLength;
        }
        truncText = truncText.slice(0, cutOffLength) + "…";
    }
    return truncText;
}


///////////////////////////////////////////////////////////////////////////////////////////
// Get the first parent of the start element that has the specified class
export function getFirstParentElementByClass(startElement, className, maxDepth = 10) {
    let checkElement = startElement.parentElement;
    while ((!checkElement.classList.contains(className)) && (maxDepth > 0)) {
        maxDepth--;
        checkElement = checkElement.parentElement;
    }
    return (checkElement.classList.contains(className) ? checkElement : null);
}


///////////////////////////////////////////////////////////////////////////////////////////
// Split up a string into the specified tag, and everything else, returned as an array.
// I.e:
// const chunks = splitStringByTag(myString, '<a class="text-link" ', '</a>')
// ... would return an array where links starting with '<a class="text-link' and are closed by
// '</a>' are split out from the rest of the text. 
export function splitStringByTag(textString, openTag, closeTag) {
    const fragments = [];

    let openIdx = 0;
    let closeIdx = 0;
    let prevIdx = 0;
    while (prevIdx < textString.length) {
        openIdx = textString.indexOf(openTag, closeIdx);

        if (openIdx == -1) {
            openIdx = textString.length;
            closeIdx = openIdx;
            fragments.push({ value: textString.substring(prevIdx, openIdx), type: "text" });
        }
        else {
            closeIdx = textString.indexOf(closeTag, openIdx) + closeTag.length;
            fragments.push({ value: textString.substring(prevIdx, openIdx), type: "text" });
            fragments.push({ value: textString.substring(openIdx, closeIdx), type: "tag" });
        }

        prevIdx = closeIdx;
    }

    return fragments;
}


///////////////////////////////////////////////////////////////////////////////////////////
// Allow a specific tag but not other kinds of HTML in the textString string, setting it as
// the content of the targetElement. 
// I.e:
// setTextWithTag(myElement, myString, 'a', '<a class="text-link" ', '</a>')
// ... would set the content of the myElement DOM element to the content of myString, where
// if it contains anchor tags starting with '<a class="text-link' those will be treated as
// HTML, while the rest of the string is treated as text. 
// Remember to set white-space: pre-wrap; on the container/target element to preserve
// newlines in the text (if desired, similar to innerText). 
export function setTextWithTag(targetElement, textString, tagName, openTag, closeTag) {
    const textFragments = splitStringByTag(textString, openTag, closeTag);
    targetElement.innerHTML = "";

    for (const fragment of textFragments) {
        if (fragment.type == "tag") {
            const newSubElement = document.createElement(tagName);
            const tempElement = document.createElement("template");
            tempElement.innerHTML = fragment.value;

            newSubElement.innerText = tempElement.content.firstElementChild.innerText;
            newSubElement.className = tempElement.content.firstElementChild.className;

            if ((tempElement.content.firstElementChild.href !== undefined) && (tempElement.content.firstElementChild.href !== null)) {
                newSubElement.href = tempElement.content.firstElementChild.href;
            }

            if ((tempElement.content.firstElementChild.target !== undefined) && (tempElement.content.firstElementChild.target !== null)) {
                newSubElement.target = tempElement.content.firstElementChild.target;
            }

            tempElement.remove();
            targetElement.appendChild(newSubElement);
        }
        else {
            targetElement.appendChild(document.createTextNode(fragment.value));
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////
// Utility to determine if a text variable has been set and assigned a value.
export function getIsValidText(text, lengthLimit = 1) {
    return ((text !== undefined) && (text !== null) && (text.length !== undefined) && (text.length >= lengthLimit));
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Kontrollera om angiven parameter är ett giltigt nummer
export function getIsValidNumber(number) {
    return (number !== undefined) && (number !== null) && !isNaN(number);
}


///////////////////////////////////////////////////////////////////////////////////////////
// Utility to determine if a variable is an array with content
export function getIsValidArray(arr, lengthLimit = 1) {
    return ((arr !== undefined) && (arr !== null) && (Array.isArray(arr)) && (arr.length !== undefined) && (arr.length >= lengthLimit));
}


///////////////////////////////////////////////////////////////////////////////////////////
//  Utility to determine if a variable is an object with properties set
export function getIsValidObject(obj, requiredProperties = 1) {
    return ((obj !== undefined) && (obj !== null) && (typeof obj == "object") && (Object.keys(obj).length >= requiredProperties));
}


///////////////////////////////////////////////////////////////////////////////////////////
// Attempt to determine if the specified URL points toward an image depending on its MIME type
// Returns a promise resolving to a boolean value if the URL points to an image. 
export async function getUrlIsImage(imageUrl) {
    const response = await fetch(imageUrl);

    if (!response.ok) {
        return false;
    }

    const result = await response.blob();
    return result.type.startsWith('image/') ?? false;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Toggle page Dark Mode on and off
export function toggleDarkMode(enableDarkMode) {
    const toggleDark = document.querySelector("#colormode-toggle-dark");
    const toggleLight = document.querySelector("#colormode-toggle-light");

    if (enableDarkMode) {
        document.body.classList.add("darkmode");
        if ((toggleDark !== undefined) && (toggleDark !== null)) {
            toggleDark.checked = true;
        }

    }
    else {
        document.body.classList.remove("darkmode");
        if ((toggleLight !== undefined) && (toggleLight !== null)) {
            toggleLight.checked = true;
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Set page Dark mode depending on the user's system darkmode setting
export function setDarkmodeBySystemSetting() {
    // Set default value depending on user darkmode system setting
    toggleDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Change value if the user changes their darkmode system setting.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        toggleDarkMode(event.matches);
    });
}


///////////////////////////////////////////////////////////////////////////////////////////
// Show an error message to the user. If the autoCloseAfter parameter is set to a number
// of milliseconds the error message will automatically close after that amount of time.
// If showInPopup is set to true the error will also be shown in an alert box. 
export function showErrorMessage(errorText, showInPopup = false, autoCloseAfter = 15000, errorBoxIdentifier = '#errors') {
    const errorBox = document.querySelector(errorBoxIdentifier);
    const errorMsg = document.createElement("div");

    errorBox.classList.add("show");
    errorMsg.innerText = errorText;
    errorBox.appendChild(errorMsg);
    errorBox.scrollIntoView();

    if (showInPopup) {
        alert(errorText);
    }

    if (autoCloseAfter > 1000) {
        setTimeout((errorMsg, errorBox) => {
            errorMsg.remove();
            if (errorBox.children.length <= 0) {
                errorBox.classList.remove("show");
            }
        }, autoCloseAfter, errorMsg, errorBox);
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Add CSS class(es) to a DOM element
export function addClassToElement(targetElement, classesToAdd) {
    if ((targetElement !== undefined) && (targetElement !== null)) {
        if (classesToAdd.length > 0) {
            if (Array.isArray(classesToAdd)) {
                targetElement.classList.add(...classesToAdd);
            }
            else if (getIsValidText(classesToAdd)) {
                targetElement.classList.add(classesToAdd);
            }
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Create and return a new DOM element with text content, optionally appending it to a parent element.
// elementClass can ba a string or an array of strings. 
// The elementAttributes parameter can be an object with a property for each attribute to set on the HTML element. 
// Set CSS "white-space: pre-wrap;" on element if allowHTML is true and you wish to keep newlines displayed. 
export function createHTMLElement(elementType, elementText, elementAttributes = null, elementClass = '', parentElement = null, allowHTML = false) {
    const newElement = document.createElement(elementType);

    // Set any attributes on the element
    if (getIsValidObject(elementAttributes, 1)) {
        for (const attributeName in elementAttributes) {
            newElement.setAttribute(attributeName, elementAttributes[attributeName]);
        }
    }

    // Set CSS class(es) on the element
    addClassToElement(newElement, elementClass);

    // Set content of element, if specified
    if (getIsValidText(elementText, 1)) {
        if (allowHTML) {
            newElement.innerHTML = elementText;
        }
        else {
            newElement.innerText = elementText;
        }
    }

    // Append to parent, if set
    if ((parentElement !== undefined) && (parentElement !== null)) {
        parentElement.appendChild(newElement);
    }
    return newElement;
}