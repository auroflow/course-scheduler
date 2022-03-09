/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import specific icons */
import {
  faTrashCan,
  faCirclePlus,
  faCaretRight,
  faCaretDown,
  faCircleXmark,
  faLeftLong,
  faRightLong,
} from '@fortawesome/free-solid-svg-icons'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* add icons to the library */
library.add(
  faTrashCan,
  faCirclePlus,
  faCaretRight,
  faCaretDown,
  faCircleXmark,
  faLeftLong,
  faRightLong
)

export default FontAwesomeIcon
