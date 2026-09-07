/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} text
 * @property {string} createdAt
 * @property {string} updatedAt
 *
 * @typedef {Object} Subtask
 * @property {string} id
 * @property {string} title
 * @property {boolean} completed
 * @property {string} [dueDate]
 *
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} quadrantId
 * @property {Subtask[]} subtasks
 * @property {number} createdAt
 * @property {boolean} completed
 * @property {boolean} supportNeeded
 * @property {boolean} isSimple
 * @property {boolean} parkingLot
 * @property {string} [dueDate]
 * @property {Comment[]} [comments]
 */
