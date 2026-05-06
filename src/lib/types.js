/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User's email address
 * @property {string} name - User's full name
 * @property {string} created_at - ISO timestamp of account creation
 */

/**
 * @typedef {Object} Dashboard
 * @property {string} id - Unique dashboard identifier
 * @property {string} name - Dashboard display name
 * @property {string} owner_email - Email of dashboard owner
 * @property {string} created_date - ISO timestamp of creation
 * @property {string} updated_date - ISO timestamp of last update
 */

/**
 * @typedef {Object} DashboardShare
 * @property {string} id - Unique share identifier
 * @property {string} dashboard_id - ID of shared dashboard
 * @property {string} owner_email - Email of dashboard owner
 * @property {string} shared_with_email - Email of user dashboard is shared with
 * @property {'view'|'edit'|'admin'} permission_level - Permission level for shared user
 */

/**
 * @typedef {Object} Note
 * @property {string} id - Unique note identifier
 * @property {string} dashboard_id - ID of parent dashboard
 * @property {string} created_by_email - Email of note creator
 * @property {string} title - Note title
 * @property {string} content - Note content in markdown format
 * @property {string[]} tags - Array of tag strings
 * @property {string} created_date - ISO timestamp of creation
 * @property {string} updated_date - ISO timestamp of last update
 * @property {number} version - Current version number
 */

/**
 * @typedef {Object} NoteVersion
 * @property {string} id - Unique version identifier
 * @property {string} note_id - ID of the note this version belongs to
 * @property {number} version_number - Sequential version number
 * @property {string} content - Version content
 * @property {string} created_by_email - Email of creator
 * @property {string} created_date - ISO timestamp of creation
 */

/**
 * Component Props Type Definitions
 * These are used for prop documentation and type checking
 */

/**
 * @typedef {Object} DashboardCardProps
 * @property {Dashboard & {permission_level?: string}} dashboard - Dashboard data to display
 * @property {boolean} isOwner - Whether current user is the dashboard owner
 * @property {string} [permission] - Permission level for shared dashboards
 */

/**
 * @typedef {Object} NoteCardProps
 * @property {Note} note - Note data to display
 * @property {Function} onUpdate - Callback when note is updated
 * @property {Function} onDelete - Callback when note is deleted
 * @property {Function} onShare - Callback to open share dialog
 */

/**
 * @typedef {Object} BadgeProps
 * @property {'owned'|'shared'|'outline'} variant - Badge visual style
 * @property {string} className - Additional CSS classes
 * @property {React.ReactNode} children - Badge content
 */

/**
 * @typedef {Object} ButtonProps
 * @property {'default'|'primary'|'ghost'} variant - Button style variant
 * @property {'sm'|'md'|'lg'|'icon'} size - Button size
 * @property {string} className - Additional CSS classes
 * @property {boolean} [disabled] - Whether button is disabled
 * @property {Function} [onClick] - Click handler
 * @property {React.ReactNode} children - Button content
 */

/**
 * @typedef {Object} DialogProps
 * @property {boolean} open - Whether dialog is open
 * @property {Function} onOpenChange - Callback when open state changes
 * @property {React.ReactNode} children - Dialog content
 */

/**
 * @typedef {Object} InputProps
 * @property {string} [type] - Input type (text, email, etc)
 * @property {string} [value] - Current input value
 * @property {Function} [onChange] - Change handler
 * @property {string} [placeholder] - Placeholder text
 * @property {boolean} [disabled] - Whether input is disabled
 * @property {string} className - Additional CSS classes
 */

/**
 * @typedef {Object} AuthState
 * @property {User | null} user - Current authenticated user
 * @property {boolean} isLoadingAuth - Whether auth is being loaded
 * @property {Object | null} authError - Auth error if any
 * @property {Function} navigateToLogin - Function to navigate to login
 */

export {};
