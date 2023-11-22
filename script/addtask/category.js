/**
 * Retrieves the name of the chosen category from the input element.
 *
 * @function
 * @returns {string} - The name of the chosen category.
 */
function loadChoosedCategory() {
    let categoryName = document.getElementById('choosedCatagory').value;
    return categoryName;
}

/**
 * Displays the input container for creating a new category and hides the existing category selection.
 *
 * @function
 * @returns {Promise<void>} - A Promise that resolves once the operation is complete.
 */
async function newCategory() {
    let newCategoryInput = document.getElementById('newCategoryInputContainer');
    let categorySelect = document.getElementById('categorySelect');
    let categoryColoredDots = document.getElementById('categoryColoredDots');
    newCategoryInput.style = 'display: flex;';
    categorySelect.style.display = 'none';
    categoryColoredDots.style = 'display:flex; justify-content:space-around;margin-block:10px -25px;';
}

/**
 * Dynamically populates the new category input container with radio buttons and colored dots based on predefined categories.
 *
 */
function loadNewCategoryInput() {
    for (let i = 0; i < CATEGORY.length; i++) {
        const group = CATEGORY[i];
        categoryColoredDots.innerHTML += newCategoryDotsHTML(group, i);
        document.getElementById(`newCatColor${i}`).style.backgroundColor = group['color'];
    }
}

/**
 * Closes the new category input container and restores the visibility of the category selection.
 *
 */
function closeNewCategory() {
    let newCategoryInput = document.getElementById('newCategoryInputContainer');
    let categorySelect = document.getElementById('categorySelect');
    let categoryColoredDots = document.getElementById('categoryColoredDots');
    newCategoryInput.style = 'display: none;';
    categorySelect.style.display = 'inline';
    categoryColoredDots.style = 'display:none;';
    let closeMenu = document.getElementsByClassName('categorySelectBtn')[0];
    closeMenu.classList.remove('open');
}

/**
 * Sets the chosen category in the input field, toggles the visibility of the category selection button, and updates the display accordingly.
 *
 * @function
 * @param {string} category - The name of the chosen category.
 */
function chooseCategory(category) {
    document.getElementById('choosedCatagory').value = category;
    const selectBtn = document.querySelector('.categorySelectBtn');
    selectBtn.classList.toggle("open");
}

/**
 * Animates the selected colored dot by scaling it up and resets the scale for other colored dots.
 *
 * @function
 * @param {string} value - The value representing the name of the radio button associated with the selected colored dot.
 */
function animateDot(value) {
    let baseScales = document.querySelectorAll('.groupDotColors');
    let colorChoosed = document.getElementById(value);
    baseScales.forEach(baseScale => {
        baseScale.style.scale = '1';
    })
    colorChoosed.style.scale = '1.5';
}

/**
 * Saves a new category with the specified name and chosen color, updates the category list, and closes the new category input container.
 *
 * @async
 * @function
 * @returns {Promise<void>} - A Promise that resolves once the operation is complete.
 */
async function saveNewCategory() {
    let newCategoryName = document.getElementById('newCategoryInput').value;
    let colorChoosed = document.querySelector('#categoryColoredDots input[type="radio"]:checked').value.toString();
    groups.push({ name: newCategoryName, color: colorChoosed });
    await setItem('groups', groups);
    loadCategory();
    closeNewCategory()
}

/**
 * Deletes the category at the specified index, updates the list of categories, and saves the changes to storage.
 *
 * @async
 * @function
 * @param {number} index - The index of the category to be deleted.
 * @returns {Promise<void>} - A Promise that resolves once the operation is complete.
 */
async function deletCategory(index) {
    event.stopPropagation();
    groups.splice(index, 1);
    await setItem('groups', groups);
    loadCategory();
}

/**
 * Closes the category selection list by removing the 'open' class.
 * 
 */
function closeCategoryLists() {
    let categorylist = document.querySelector('.categorySelectBtn');
    if (categorylist) categorylist.classList.remove('open');
}