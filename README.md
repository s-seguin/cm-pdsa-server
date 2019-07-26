# cm-pdsa-server

CM PDSA - Admin Panel Server

## Getting Started

#### Clone this repository

```bash
git clone ssh://git@bitbucket.criticalmass.com:7999/cip/cm-pdsa-server.git
```

## Branching Strategy

All development work should be done on your own branch.

1. Cut a `feature` or `bugfix` branch off of develop

2. Create a pull request to merge your feature back into develop.

3. Pull requests will be reviewed by two mentors, then merged back into develop.

## Server Info

Entry point for this application is `index.js`, as we are using ESM to provide ES6 compatibility.

Routes should be kept clean and all logic should reside in a controller.

Database connects to local `test` MongoDB via Mongoose, connection is opened upon server initialization. This will need to be changed for Production.

## Running

1. Ensure MongoDB is installed and running as a service.
   - Follow this guide to install and start: <https://gist.github.com/nrollr/9f523ae17ecdbb50311980503409aeb3>
   - Summary:
     - `$ brew install mongodb` -> use to install
     - `$ brew services start mongodb` -> use to start service
2. `npm i` to install all dependencies.
3. `npm start` to start server using `nodemon`.

## Models

---

### Metadata

---

#### PrimarySkillArea

This model is used to store the different Primary Skill Areas.

##### Fields

| Name   | Description                      | Type       | Required             |
| ------ | -------------------------------- | ---------- | -------------------- |
| name   | The name of the PrimarySkillArea | `String`   | `true`               |
| _\_id_ | Auto generated ObjectId          | `ObjectId` | _Created by MongoDb_ |

##### Example

To create a new `PrimarySkillArea` supply an object like:

```JSON
{
    name: "Leadership and Development "
}
```

#### SecondarySkillArea

This model is used to store the different Secondary Skill Areas. Each Secondary Skill can have references to multiple `PrimarySkillArea` but they are not required.

##### Fields

| Name                       | Description                                                                                         | Type         | Required             |
| -------------------------- | --------------------------------------------------------------------------------------------------- | ------------ | -------------------- |
| name                       | The name of the SecondarySkillArea                                                                  | `String`     | `true`               |
| primarySkillAreaReferences | An array of ObjectIds that references the PrimarySkillArea this SecondarySkillArea associates with. | [`ObjectId`] | `false`              |
| _\_id_                     | Auto generated ObjectId                                                                             | `ObjectId`   | _Created by MongoDb_ |

##### Example

To create a new `SecondarySkillArea` supply an object like:

```JSON
{
    primarySkillAreaReferences: ["5d2f90067c30290af1f0fe63"],
    name: "Teamwork"
}
```

#### Institution

This model is used to store the different Institutions.

##### Fields

| Name   | Description                 | Type       | Required             |
| ------ | --------------------------- | ---------- | -------------------- |
| name   | The name of the Institution | `String`   | `true`               |
| _\_id_ | Auto generated ObjectId     | `ObjectId` | _Created by MongoDb_ |

##### Example

To create a new `Institution` supply an object like:

```JSON
{
    name: "University of Calgary"
}
```

#### Program

This model is used to store the different Program. Each Program belongs to a Institution and has a reference to its parent.

##### Fields

| Name        | Description                                                          | Type       | Required             |
| ----------- | -------------------------------------------------------------------- | ---------- | -------------------- |
| name        | The name of the Program                                              | `String`   | `true`               |
| institution | An ObjectId that references the institution this Program belongs to. | `ObjectId` | `true`               |
| _\_id_      | Auto generated ObjectId                                              | `ObjectId` | _Created by MongoDb_ |

##### Example

To create a new `Program` supply an object like:

```JSON
{
    name: "Certificate for Emerging Leaders ",
    institution: "6e3cdba46b1773f69114c8c9"
}
```

### PDSA Items

---

#### PDSA Item

This model is used as the base model (or abstract model) of all PDSA items. It is especially for querying against all types of PDSA Items and deleting PDSA Items as it is generic. However you are unable to instantiate PDSA Items through the API, instead use a specific type.

##### Fields

| Name                      | Description                                                                                                              | Type                                                                                           | Required             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------- |
| name                      | The name of the Program                                                                                                  | `String`                                                                                       | `true`               |
| primarySkillAreas         | An array of ObjectIds that references the primarySkillAreas associated with this PDSA Item.                              | [`ObjectId`]                                                                                   | `true`               |
| secondarySkillAreas       | An array of ObjectIds that references the secondarySkillAreas associated with this PDSA Item.                            | [`ObjectId`]                                                                                   | `true`               |
| primarySkillAreaSortKey   | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| secondarySkillAreaSortKey | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| url                       | Links to the the PDSA items website.                                                                                     | `String`                                                                                       | `true`               |
| startingPdsaTier          | Denotes the first PDSA level this item is avaliable too. Must be values between [1-4].                                   | `Number`                                                                                       | `true`               |
| cost                      | An object to hold the various parts of an items cost. Mainly the min and max, currency and if there is a group discount. | { currency: `String`, minCost: `Number`, maxCost: `Number`, groupPricingAvailable: `Boolean` } | `true`               |
| previousAttendees         | An array of the names of previous employess who hae attended or purchased this PDSA Item.                                | [`String`]                                                                                     | `false`              |
| reviews                   | A list of reviews that users have provided.                                                                              | [{rating:`Number`, review:`String`, reviewedBy:`String`}]                                      | `false`              |
| comments                  | Any additional comments HR would like to attach.                                                                         | `String`                                                                                       | `false`              |
| visible                   | Denotes whether item is visible or invisible to employees.                                                               | `Boolean`                                                                                      | `true`               |
| _\_id_                    | Auto generated ObjectId                                                                                                  | `ObjectId`                                                                                     | _Created by MongoDb_ |

##### Validation

| Field    | Validation                                                            |
| -------- | --------------------------------------------------------------------- |
| currency | Must be in `['CAD', 'USD', 'EUR', 'GBP', 'HKD', 'CRC', 'BRL', 'JPY']` |
| minCost  | Must be less than maxCost or equal if only one price.                 |
| maxCost  | Must be greater than minCost or equak if only one price.              |

#### Book

This model is used to store books as PDSA items. It inherits from **PDSAItem**, and has all of those fields plus the additional fields bolded below.

##### Fields

| Name                      | Description                                                                                                              | Type                                                                                           | Required             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------- |
| name                      | The name of the Program                                                                                                  | `String`                                                                                       | `true`               |
| primarySkillAreas         | An array of ObjectIds that references the primarySkillAreas associated with this PDSA Item.                              | [`ObjectId`]                                                                                   | `true`               |
| secondarySkillAreas       | An array of ObjectIds that references the secondarySkillAreas associated with this PDSA Item.                            | [`ObjectId`]                                                                                   | `true`               |
| primarySkillAreaSortKey   | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| secondarySkillAreaSortKey | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| url                       | Links to the the PDSA items website.                                                                                     | `String`                                                                                       | `true`               |
| startingPdsaTier          | Denotes the first PDSA level this item is avaliable too. Must be values between [1-4].                                   | `Number`                                                                                       | `true`               |
| cost                      | An object to hold the various parts of an items cost. Mainly the min and max, currency and if there is a group discount. | { currency: `String`, minCost: `Number`, maxCost: `Number`, groupPricingAvailable: `Boolean` } | `true`               |
| previousAttendees         | An array of the names of previous employees who hae attended or purchased this PDSA Item.                                | [`String`]                                                                                     | `false`              |
| reviews                   | A list of reviews that users have provided.                                                                              | [{rating:`Number`, review:`String`, reviewedBy:`String`}]                                      | `false`              |
| comments                  | Any additional comments HR would like to attach.                                                                         | `String`                                                                                       | `false`              |
| **author**                | **The name of the book's author.**                                                                                       | **`String`**                                                                                   | **`false`**          |
| **publisher**             | **The name of book's publisher.**                                                                                        | **`String`**                                                                                   | **`false`**          |
| visible                   | Denotes whether item is visible or invisible to employees.                                                               | `Boolean`                                                                                      | `true`               |
| _\_id_                    | Auto generated ObjectId                                                                                                  | `ObjectId`                                                                                     | _Created by MongoDb_ |

##### Example

To create a new `Book` supply an object like:

```JSON
{
    name: "New Book",
    primarySkillAreas: [
        "5d1b7d4dcbb67eb5487bf12a",
        "5d16532b8f741ead3ee636d2"
    ],
    secondarySkillAreas: [
        "5d1b85db03eda5c68e3b9718"
    ],
    url: "http://www.some_url.com",
    startingPdsaTier: 1,
    cost: {
        currency: "CAD",
        minCost: 12.75,
        maxCost: 18.50,
        groupPricingAvailable: false
    },
    author: "John Doe",
    publisher: "JD Publishing House",
    visible: true
}
```

_Please note:_ Supplied book example only used mandatory fields.

#### Certification

This model is used to store certifications as PDSA items. It inherits from **PDSAItem**, and has all of those fields plus the additional fields bolded below.

##### Fields

| Name                      | Description                                                                                                              | Type                                                                                           | Required             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------- |
| name                      | The name of the Program                                                                                                  | `String`                                                                                       | `true`               |
| primarySkillAreas         | An array of ObjectIds that references the primarySkillAreas associated with this PDSA Item.                              | [`ObjectId`]                                                                                   | `true`               |
| secondarySkillAreas       | An array of ObjectIds that references the secondarySkillAreas associated with this PDSA Item.                            | [`ObjectId`]                                                                                   | `true`               |
| primarySkillAreaSortKey   | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| secondarySkillAreaSortKey | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| url                       | Links to the the PDSA items website.                                                                                     | `String`                                                                                       | `true`               |
| startingPdsaTier          | Denotes the first PDSA level this item is avaliable too. Must be values between [1-4].                                   | `Number`                                                                                       | `true`               |
| cost                      | An object to hold the various parts of an items cost. Mainly the min and max, currency and if there is a group discount. | { currency: `String`, minCost: `Number`, maxCost: `Number`, groupPricingAvailable: `Boolean` } | `true`               |
| previousAttendees         | An array of the names of previous employees who hae attended or purchased this PDSA Item.                                | [`String`]                                                                                     | `false`              |
| reviews                   | A list of reviews that users have provided.                                                                              | [{rating:`Number`, review:`String`, reviewedBy:`String`}]                                      | `false`              |
| comments                  | Any additional comments HR would like to attach.                                                                         | `String`                                                                                       | `false`              |
| **institution**           | **A reference to the institution offering the certification.**                                                           | **`ObjectId`**                                                                                 | **`false`**          |
| **deliveryMethod**        | **Whether the certification is offered `online`, `in-class` or `both`.**                                                 | **`String`**                                                                                   | **`false`**          |
| **location**              | **The location the certification is from or being offered. With no commas.**                                             | **`String`**                                                                                   | **`false`**          |
| **ongoing**               | **Denotes whether or not the certification is currently being offered and ongoing.**                                     | **`Boolean`**                                                                                  | **`false`**          |
| visible                   | Denotes whether item is visible or invisible to employees.                                                               | `Boolean`                                                                                      | `true`               |
| _\_id_                    | Auto generated ObjectId                                                                                                  | `ObjectId`                                                                                     | _Created by MongoDb_ |

##### Example

To create a new `Certification` supply an object like:

```JSON
{
    name: "New Certification",
    primarySkillAreas: [
        "5d1b7d4dcbb67eb5487bf12a",
        "5d16532b8f741ead3ee636d2"
    ],
    secondarySkillAreas: [
        "5d1b85db03eda5c68e3b9718"
    ],
    url: "http://www.some_url.com",
    startingPdsaTier: 1,
    cost: {
        currency: "CAD",
        minCost: 12.75,
        maxCost: 18.50,
        groupPricingAvailable: false
    },
    institution: "x56jb85db03eda5c68e3b9718",
    deliveryMethod: "online",
    location: "Calgary AB Canada"
    ongoing: true,
    visible: true
}
```

_Please note:_ Supplied certification example only used mandatory fields.

#### Conference

This model is used to store conferences as PDSA items. It inherits from **PDSAItem**, and has all of those fields plus the additional fields bolded below.

##### Fields

| Name                      | Description                                                                                                              | Type                                                                                           | Required             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------- |
| name                      | The name of the Program                                                                                                  | `String`                                                                                       | `true`               |
| primarySkillAreas         | An array of ObjectIds that references the primarySkillAreas associated with this PDSA Item.                              | [`ObjectId`]                                                                                   | `true`               |
| secondarySkillAreas       | An array of ObjectIds that references the secondarySkillAreas associated with this PDSA Item.                            | [`ObjectId`]                                                                                   | `true`               |
| primarySkillAreaSortKey   | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| secondarySkillAreaSortKey | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| url                       | Links to the the PDSA items website.                                                                                     | `String`                                                                                       | `true`               |
| startingPdsaTier          | Denotes the first PDSA level this item is avaliable too. Must be values between [1-4].                                   | `Number`                                                                                       | `true`               |
| cost                      | An object to hold the various parts of an items cost. Mainly the min and max, currency and if there is a group discount. | { currency: `String`, minCost: `Number`, maxCost: `Number`, groupPricingAvailable: `Boolean` } | `true`               |
| previousAttendees         | An array of the names of previous employees who hae attended or purchased this PDSA Item.                                | [`String`]                                                                                     | `false`              |
| reviews                   | A list of reviews that users have provided.                                                                              | [{rating:`Number`, review:`String`, reviewedBy:`String`}]                                      | `false`              |
| comments                  | Any additional comments HR would like to attach.                                                                         | `String`                                                                                       | `false`              |
| **institution**           | **A reference to the institution offering the conference.**                                                              | **`ObjectId`**                                                                                 | **`false`**          |
| **deliveryMethod**        | **Whether the conference is offered `online`, `in-class` or `both`.**                                                    | **`String`**                                                                                   | **`false`**          |
| **location**              | **The location the certification is from or being offered. With no commas.**                                             | **`String`**                                                                                   | **`false`**          |
| **notableDates**          | **An object containing the start and end date of the conference, and any other notable dates.**                          | **{ start: `Date`, end: `Date`, otherDates:[`Date`] }**                                        | **`false`**          |
| **ongoing**               | **Denotes whether or not the conference is currently being offered and ongoing.**                                        | **`Boolean`**                                                                                  | **`false`**          |
| visible                   | Denotes whether item is visible or invisible to employees.                                                               | `Boolean`                                                                                      | `true`               |
| _\_id_                    | Auto generated ObjectId                                                                                                  | `ObjectId`                                                                                     | _Created by MongoDb_ |

##### Example

To create a new `Conference` supply an object like:

```JSON
{
    name: "New Conference",
    primarySkillAreas: [
        "5d1b7d4dcbb67eb5487bf12a",
        "5d16532b8f741ead3ee636d2"
    ],
    secondarySkillAreas: [
        "5d1b85db03eda5c68e3b9718"
    ],
    url: "http://www.some_url.com",
    startingPdsaTier: 1,
    cost: {
        currency: "CAD",
        minCost: 12.75,
        maxCost: 18.50,
        groupPricingAvailable: false
    },
    institution: "x56jb85db03eda5c68e3b9718",
    deliveryMethod: "online",
    location: "Calgary AB Canada",
    notableDates: {
        start: "2019-01-01",
        end: "2019-02-01",
        otherDates: ["1999-12-31"]

    },
    ongoing: true,
    visible: true
}
```

_Please note:_ Supplied conference example only used mandatory fields.

#### Course-Seminar

This model is used to store courses and seminars as PDSA items. It inherits from **PDSAItem**, and has all of those fields plus the additional fields bolded below.

##### Fields

| Name                      | Description                                                                                                              | Type                                                                                           | Required             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------- |
| name                      | The name of the Program                                                                                                  | `String`                                                                                       | `true`               |
| primarySkillAreas         | An array of ObjectIds that references the primarySkillAreas associated with this PDSA Item.                              | [`ObjectId`]                                                                                   | `true`               |
| secondarySkillAreas       | An array of ObjectIds that references the secondarySkillAreas associated with this PDSA Item.                            | [`ObjectId`]                                                                                   | `true`               |
| primarySkillAreaSortKey   | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| secondarySkillAreaSortKey | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| url                       | Links to the the PDSA items website.                                                                                     | `String`                                                                                       | `true`               |
| startingPdsaTier          | Denotes the first PDSA level this item is avaliable too. Must be values between [1-4].                                   | `Number`                                                                                       | `true`               |
| cost                      | An object to hold the various parts of an items cost. Mainly the min and max, currency and if there is a group discount. | { currency: `String`, minCost: `Number`, maxCost: `Number`, groupPricingAvailable: `Boolean` } | `true`               |
| previousAttendees         | An array of the names of previous employees who hae attended or purchased this PDSA Item.                                | [`String`]                                                                                     | `false`              |
| reviews                   | A list of reviews that users have provided.                                                                              | [{rating:`Number`, review:`String`, reviewedBy:`String`}]                                      | `false`              |
| comments                  | Any additional comments HR would like to attach.                                                                         | `String`                                                                                       | `false`              |
| **institution**           | **A reference to the institution offering the course or seminar.**                                                       | **`ObjectId`**                                                                                 | **`false`**          |
| **program**               | **A reference to the program the course or seminar is a part of.**                                                       | **`ObjectId`**                                                                                 | **`false`**          |
| **deliveryMethod**        | **Whether the course - seminar is offered `online`, `in-class` or `both`.**                                              | **`String`**                                                                                   | **`false`**          |
| **location**              | **The location the certification is from or being offered. With no commas.**                                             | **`String`**                                                                                   | **`false`**          |
| **notableDates**          | **An object containing the start and end date of the course or seminar, and any other notable dates.**                   | **{ start: `Date`, end: `Date`, otherDates:[`Date`] }**                                        | **`false`**          |
| **ongoing**               | **Denotes whether or not the course seminar is currently being offered and ongoing.**                                    | **`Boolean`**                                                                                  | **`false`**          |
| visible                   | Denotes whether item is visible or invisible to employees.                                                               | `Boolean`                                                                                      | `true`               |
| _\_id_                    | Auto generated ObjectId                                                                                                  | `ObjectId`                                                                                     | _Created by MongoDb_ |

##### Example

To create a new `course-seminar` supply an object like:

```JSON
{
    name: "New Course-Seminar",
    primarySkillAreas: [
        "5d1b7d4dcbb67eb5487bf12a",
        "5d16532b8f741ead3ee636d2"
    ],
    secondarySkillAreas: [
        "5d1b85db03eda5c68e3b9718"
    ],
    url: "http://www.some_url.com",
    startingPdsaTier: 1,
    cost: {
        currency: "CAD",
        minCost: 1200,
        maxCost: 1800,
        groupPricingAvailable: true
    },
    institution: "x56jb85db03eda5c68e3b9718",
    program: "k899adb03eda5c68e4cf9871",
    deliveryMethod: "online",
    location: "Calgary AB Canada",
    notableDates: {
        start: "2019-01-01",
        end: "2019-02-01",
        otherDates: ["1999-12-31"]

    },
    ongoing: true,
    visible: true
}
```

_Please note:_ Supplied course-seminar example only used mandatory fields.

#### Subscription

This model is used to store subscriptions as PDSA items. It inherits from **PDSAItem**, and has all of those fields plus the additional fields bolded below.

##### Fields

| Name                      | Description                                                                                                              | Type                                                                                           | Required             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------- |
| name                      | The name of the Program                                                                                                  | `String`                                                                                       | `true`               |
| primarySkillAreas         | An array of ObjectIds that references the primarySkillAreas associated with this PDSA Item.                              | [`ObjectId`]                                                                                   | `true`               |
| secondarySkillAreas       | An array of ObjectIds that references the secondarySkillAreas associated with this PDSA Item.                            | [`ObjectId`]                                                                                   | `true`               |
| primarySkillAreaSortKey   | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| secondarySkillAreaSortKey | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| url                       | Links to the the PDSA items website.                                                                                     | `String`                                                                                       | `true`               |
| startingPdsaTier          | Denotes the first PDSA level this item is avaliable too. Must be values between [1-4].                                   | `Number`                                                                                       | `true`               |
| cost                      | An object to hold the various parts of an items cost. Mainly the min and max, currency and if there is a group discount. | { currency: `String`, minCost: `Number`, maxCost: `Number`, groupPricingAvailable: `Boolean` } | `true`               |
| previousAttendees         | An array of the names of previous employees who hae attended or purchased this PDSA Item.                                | [`String`]                                                                                     | `false`              |
| reviews                   | A list of reviews that users have provided.                                                                              | [{rating:`Number`, review:`String`, reviewedBy:`String`}]                                      | `false`              |
| comments                  | Any additional comments HR would like to attach.                                                                         | `String`                                                                                       | `false`              |
| **institution**           | **A reference to the institution offering the subscription.**                                                            | **`ObjectId`**                                                                                 | **`false`**          |
| **deliveryMethod**        | **Whether the subscription is offered `online`, `in-class` or `both`.**                                                  | **`String`**                                                                                   | **`false`**          |
| **duration**              | **How long the subscription is, e.g. 'yearly', '3 months', 'monthly', etc.**                                             | **`String`**                                                                                   | **`false`**          |
| **ongoing**               | **Denotes whether or not the subscription is currently being offered and ongoing.**                                      | **`Boolean`**                                                                                  | **`false`**          |
| visible                   | Denotes whether item is visible or invisible to employees.                                                               | `Boolean`                                                                                      | `true`               |
| _\_id_                    | Auto generated ObjectId                                                                                                  | `ObjectId`                                                                                     | _Created by MongoDb_ |

##### Example

To create a new `Subscription` supply an object like:

```JSON
{
    name: "New Conference",
    primarySkillAreas: [
        "5d1b7d4dcbb67eb5487bf12a",
        "5d16532b8f741ead3ee636d2"
    ],
    secondarySkillAreas: [
        "5d1b85db03eda5c68e3b9718"
    ],
    url: "http://www.some_url.com",
    startingPdsaTier: 1,
    cost: {
        currency: "CAD",
        minCost: 12.75,
        maxCost: 18.50,
        groupPricingAvailable: false
    },
    institution: "x56jb85db03eda5c68e3b9718",
    deliveryMethod: "online",
    duration: "yearly",
    ongoing: true,
    visible: true
}
```

_Please note:_ Supplied subscription example only used mandatory fields.

#### Other

This model is used to store all other PDSA items that do not belong to book, certification, conference, course-seminar, or subscription. It inherits from **PDSAItem**, and has all of those fields plus the additional fields bolded below.

##### Fields

| Name                      | Description                                                                                                              | Type                                                                                           | Required             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------- |
| name                      | The name of the Program                                                                                                  | `String`                                                                                       | `true`               |
| primarySkillAreas         | An array of ObjectIds that references the primarySkillAreas associated with this PDSA Item.                              | [`ObjectId`]                                                                                   | `true`               |
| secondarySkillAreas       | An array of ObjectIds that references the secondarySkillAreas associated with this PDSA Item.                            | [`ObjectId`]                                                                                   | `true`               |
| primarySkillAreaSortKey   | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| secondarySkillAreaSortKey | This is internally created and managed. It allows us to easily sort via skill areas.                                     | `String`                                                                                       | _Managed internally_ |
| url                       | Links to the the PDSA items website.                                                                                     | `String`                                                                                       | `true`               |
| startingPdsaTier          | Denotes the first PDSA level this item is avaliable too. Must be values between [1-4].                                   | `Number`                                                                                       | `true`               |
| cost                      | An object to hold the various parts of an items cost. Mainly the min and max, currency and if there is a group discount. | { currency: `String`, minCost: `Number`, maxCost: `Number`, groupPricingAvailable: `Boolean` } | `true`               |
| previousAttendees         | An array of the names of previous employees who hae attended or purchased this PDSA Item.                                | [`String`]                                                                                     | `false`              |
| reviews                   | A list of reviews that users have provided.                                                                              | [{rating:`Number`, review:`String`, reviewedBy:`String`}]                                      | `false`              |
| comments                  | Any additional comments HR would like to attach.                                                                         | `String`                                                                                       | `false`              |
| **institution**           | **A reference to the institution offering the item.**                                                                    | **`ObjectId`**                                                                                 | **`false`**          |
| **program**               | **A reference to the program the item is a part of.**                                                                    | **`ObjectId`**                                                                                 | **`false`**          |
| **deliveryMethod**        | **Whether the item is offered `online`, `in-class` or `both`.**                                                          | **`String`**                                                                                   | **`false`**          |
| **location**              | **The location the certification is from or being offered. With no commas.**                                             | **`String`**                                                                                   | **`false`**          |
| **notableDates**          | **An object containing the start and end date of the item, and any other notable dates.**                                | **{ start: `Date`, end: `Date`, otherDates:[`Date`] }**                                        | **`false`**          |
| **ongoing**               | **Denotes whether or not the item is currently being offered and ongoing.**                                              | **`Boolean`**                                                                                  | **`false`**          |
| visible                   | Denotes whether item is visible or invisible to employees.                                                               | `Boolean`                                                                                      | `true`               |
| _\_id_                    | Auto generated ObjectId                                                                                                  | `ObjectId`                                                                                     | _Created by MongoDb_ |

##### Example

To create a new `Other` supply an object like:

```JSON
{
    name: "New Other",
    primarySkillAreas: [
        "5d1b7d4dcbb67eb5487bf12a",
        "5d16532b8f741ead3ee636d2"
    ],
    secondarySkillAreas: [
        "5d1b85db03eda5c68e3b9718"
    ],
    url: "http://www.some_url.com",
    startingPdsaTier: 1,
    cost: {
        currency: "CAD",
        minCost: 1250,
        maxCost: 1250,
        groupPricingAvailable: false
    },
    institution: "x56jb85db03eda5c68e3b9718",
    program: "j45gb78bd03cwo5c68e3b0127",
    deliveryMethod: "online",
    location: "Calgary AB Canada",
    notableDates: {
        start: "2019-01-01",
        end: "2019-02-01",
        otherDates: ["1999-12-31"]

    },
    ongoing: true,
    visible: true
}
```

_Please note:_ Supplied other example only used mandatory fields.

## Endpoints

---

### Metadata

---

#### Get all locations

This route is used to grab all the locations being used in the database.

##### URL

`HTTP GET http://cm-pdsa-server/metadata/locations`

##### Response

| Status                                | Code  | Response                                                                |
| ------------------------------------- | ----- | ----------------------------------------------------------------------- |
| Fetched successfully                  | `200` | Server responds with an array of locations.                             |
| Invalid type                          | `400` | Server responds with error message.                                     |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object. |

##### Examples

###### Retrieving all Institutions

```Javascript
GET 'http://cm-pdsa-server/metadata/locations'
```

```Javascript
RESPONSE:
[
    "Calgary AB Canada",
    "Toronto ON Canada",
    "Chicago USA"
]
```

#### Create

##### Description

This route is used to create a new metadata object, specified by the type parameter in the URL. Types can be one of the following `primary-skills`, `secondary-skills`, `programs` or `institutions`.

##### URL

`HTTP POST http://cm-pdsa-server/metadata/:type`

##### Parameters

| Parameter | Possible values                                               |
| --------- | ------------------------------------------------------------- |
| `:type`   | `primary-skills` `secondary-skills` `programs` `institutions` |

##### Body

The request body is the object you wish to create. Please see documentation for metadata models.

##### Response

| Status               | Code  | Response                                                                |
| -------------------- | ----- | ----------------------------------------------------------------------- |
| Created successfully | `201` | Server responds with the object created.                                |
| Invalid type         | `400` | Server responds with error message.                                     |
| Server error         | `500` | Server responds with the error message throw while creating the object. |

##### Examples

###### Creating a new primary skill

```Javascript
POST http://cm-pdsa-server/metadata/primary-skills

REQUEST.BODY:
{
    name: "Leadership and Development "
}
```

```Javascript
RESPONSE:
{
    "_id": "5d27b965360bcc6761543637",
    "name": "Leadership and Development",
    "__v": 0
}
```

###### Creating a new secondary skill

```Javascript
POST http://cm-pdsa-server/metadata/secondary-skills

REQUEST.BODY:
{
    name: "Teamwork",
    primarySkillAreaReferences: ["5d27b965360bcc6761543637"]
}
```

```Javascript
RESPONSE:
{
    "_id": "5d27b993360bcc6761543638",
    "name": "Teamwork",
    "primarySkillAreaReferences": ["5d27b965360bcc6761543637"],
    "__v": 0
}
```

#### Read

##### Description

These routes are used to find information about the metadata objects. You can query by `type`, `id`, `name` and by `parent-id`. Types can be one of the following `primary-skills`, `secondary-skills`, `programs` or `institutions`. Id must be a valid `ObjectId` for the metadata object being retrieved. Name matches to the name of the object being retrieved and parent-id must be a valid `ObjectId` of the parent object.

##### URLS

`HTTP GET http://cm-pdsa-server/metadata/:type` => Returns all metadata objects of specified type.

`HTTP GET http://cm-pdsa-server/metadata/:type/:id` => Returns the metadata object matching specified type and id.

`HTTP GET http://cm-pdsa-server/metadata/:type/name/:name` => Returns all metadata objects matching specified type and name (there should only be one object as names should be unique).

`HTTP GET http://cm-pdsa-server/metadata/:type/parent-id/:parentId` => Returns all metadata objects matching specified type and parent-id.

##### Parameters

| Parameter    | Possible values                                                           |
| ------------ | ------------------------------------------------------------------------- |
| `:type`      | `primary-skills` `secondary-skills` `programs` `institutions`             |
| `:id`        | Valid `ObjectId` for the metadata object to retrieve                      |
| `:name`      | The name of the object to retrieve                                        |
| `:parent-id` | The `ObjectId` of the parent object (`Institution` or `PrimarySkillArea`) |

##### Body

No request body should be supplied.

##### Response

| Status                                | Code  | Response                                                                                                                                                                                                                              |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fetched successfully                  | `200` | Server responds with the object requested when specified by `id`. Otherwise an object containing `docs` which is an array of all objects (Mongo documents) matching the request and `totalDocs` which is the count of docs in `docs`. |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                                                                                   |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                                                                                               |

##### Examples

###### Retrieving all Institutions

```Javascript
GET 'http://cm-pdsa-server/metadata/institutions'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "_id": "5d28e2886778eb82b6ef13f1",
            "name": "University of Calgary",
            "__v": 0
        },
        {
            "_id": "5d28e2e76778eb82b6ef13f2",
            "name": "AWS",
            "__v": 0
        }
    ],
    "totalDocs": 2
}
```

###### Retrieving the 'University of Calgary' Institution by ID

```Javascript
GET 'http://cm-pdsa-server/metadata/institutions/5d28e2886778eb82b6ef13f1'
```

```Javascript
RESPONSE:
{
    "_id": "5d28e2886778eb82b6ef13f1",
    "name": "University of Calgary",
    "__v": 0
}
```

###### Retrieving the 'University of Calgary' Institution by name

```Javascript
GET 'http://cm-pdsa-server/metadata/institutions/name/University of Calgary'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "_id": "5d28e2886778eb82b6ef13f1",
            "name": "University of Calgary",
            "__v": 0
        }
    ],
    "totalDocs": 1
}
```

###### Retrieving all programs offered by the 'University of Calgary'

```Javascript
GET 'http://cm-pdsa-server/metadata/programs/parent-id/5d28e2886778eb82b6ef13f1'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "_id": "5d0bbce9a4e95add5f4f82e2",
            "name": "Computer Science",
            "institution": {
                "_id": "5d28e2886778eb82b6ef13f1",
                "name": "University of Calgary",
                "__v": 0
            },
            "__v": 0
        },
        {
            "_id": "5d0bbcfaa4e95add5f4f82e3",
            "name": "Bioscience",
            "institution": {
                "_id": "5d28e2886778eb82b6ef13f1",
                "name": "University of Calgary",
                "__v": 0
            },
            "__v": 0
        },
        {
            "_id": "5d1633e79b382b9e4d360da8",
            "name": "Certificate for Emerging Leaders",
            "institution": {
                "_id": "5d28e2886778eb82b6ef13f1",
                "name": "University of Calgary",
                "__v": 0
            },
            "__v": 0
        }
    ],
    "totalDocs": 3
}
```

###### Retrieving all SecondarySkillAreas under by the 'Learning and Development'

```Javascript
GET 'http://cm-pdsa-server/metadata/secondary-skills/parent-id/5d30a1a7018fdd1d70dee024'
```

```Javascript
RESPONSE:
{
    "docs": [
         {
            "primarySkillAreaReferences": [
                {
                    "_id": "5d30a1a7018fdd1d70dee024",
                    "name": "Learning and Development",
                    "__v": 0
                }
            ],
            "_id": "5d30cfd9a4841731c45f8250",
            "name": "Python",
            "__v": 0
        }
    ],
    "totalDocs": 1
}
```

#### Update

##### Description

This route is used to update an existing metadata object, specified by the type and id parameter in the URL. Types can be one of the following `primary-skills`, `secondary-skills`, `programs` or `institutions`, and id must be a valid `ObjectId` for the metadata object being updated.

##### URLS

`HTTP PATCH http://cm-pdsa-server/metadata/:type/:id`
`HTTP PUT http://cm-pdsa-server/metadata/:type/:id`

Use `PATCH` when updating some fields but not all. Use `PUT` when updating the entire object.

##### Parameters

| Parameter | Possible values                                               |
| --------- | ------------------------------------------------------------- |
| `:type`   | `primary-skills` `secondary-skills` `programs` `institutions` |
| `:id`     | Valid `ObjectId` for the metadata object to update            |

##### Body

The request body is a JSON object containing the fields you wish to update and their new values. Please see documentation for metadata models, for possible fields to update.

##### Response

| Status                                | Code  | Response                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Updated successfully                  | `200` | Server responds an object containing number of objects matching the id: `n`, number of objects updated: `nModified`, if the request was completed successfully: `ok` and the number of sort key updated on PDSA items: `nSortKeysUpdated` (used to sort PDSA items via skill areas, if no SortKeys were updated this field is not present) |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                                                                                                                                                                                        |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                                                                                                                                                                                                    |

##### Examples

###### Updating the Leadership and Development PrimarySkillArea with a new name

```Javascript
PATCH 'http://cm-pdsa-server/metadata/primary-skills/5d27b965360bcc6761543637'

REQUEST.BODY:
{
    name: "Learning and Growth"
}
```

```Javascript
RESPONSE:
{
    "n": 1,
    "nModified": 1,
    "ok": 1,
    "nSortKeysUpdated": 3
}
```

###### Successfully updating the Teamwork SecondarySkillArea with a new parentPrimarySkillArea

```Javascript
PATCH 'http://cm-pdsa-server/metadata/secondary-skills/5d27b993360bcc6761543638'

REQUEST.BODY:
{
    parentPrimarySkillArea: "5d1e34439eda691c184246d4"
}
```

```Javascript
RESPONSE:
{
    "n": 1,
    "nModified": 1,
    "ok": 1,
    "nSortKeysUpdated": 3
}
```

###### Trying to update the Teamwork SecondarySkillArea with the same parentPrimarySkillArea

```Javascript
PATCH 'http://cm-pdsa-server/metadata/secondary-skills/5d27b993360bcc6761543638'

REQUEST.BODY:
{
    parentPrimarySkillArea: "5d1e34439eda691c184246d4"
}
```

```Javascript
RESPONSE:
{
    "n": 1,
    "nModified": 0,
    "ok": 1
}
```

#### Delete

##### Description

This route is used to force delete an existing metadata object, specified by the type and id parameter in the URL. Types can be one of the following `primary-skills`, `secondary-skills`, `programs` or `institutions`, and id must be a valid `ObjectId` for the metadata object being deleted.

**Please note:**

- The object will be completely deleted and cannot be recovered.
- If the object is a `PrimarySkillArea` or `Institution` and has children referencing it, those children will also be deleted. (Similar to a SQL cascade delete)
- If the object is a skill area and has other PDSAItems referencing it, those sort keys will be updated

##### URLS

`HTTP DELETE http://cm-pdsa-server/metadata/:type/:id`

##### Parameters

| Parameter | Possible values                                               |
| --------- | ------------------------------------------------------------- |
| `:type`   | `primary-skills` `secondary-skills` `programs` `institutions` |
| `:id`     | Valid `ObjectId` for the metadata object to delete            |

##### Body

No request body should be supplied.

##### Response

| Status                                | Code  | Response                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deleted successfully                  | `200` | Server responds with an object containing `n`: the number of objects matching the id, `ok`: if the query executed ok, `deletedCount`: how many items matching _id_ were deleted, `nChildrenDeleted`: if type was _primary-skills_ or _institutions_ and there were children referencing the object we deleted, how many children were deleted also, `nSortKeysUpdated`: if the metadata object was a sill area and had sort keys referencing it, how many of those were updated. |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                                                                                                                                                                                                                                                                                                                                          |

##### Examples

###### Deleting the 'Learning and Growth' PrimarySkillArea

```Javascript
DELETE 'http://cm-pdsa-server/pdsa/primary-skills/5d27b965360bcc6761543637'
```

```Javascript
RESPONSE:
{
    "n": 1,
    "ok": 1,
    "deletedCount": 1,
    "nChildrenDeleted": 1
}
```

### PDSA

---

#### Create

##### Description

This route is used to create a new PDSA objects, specified by the type parameter in the URL. Types can be one of the following `books`, `certifications`, `conferences`, `course-seminars`, `subscriptions` or `other`.

**Note:** you cannot create generic `pdsa-items` use one of the types instead.

##### URL

`HTTP POST http://cm-pdsa-server/pdsa/:type`

##### Parameters

| Parameter | Possible values                                                                  |
| --------- | -------------------------------------------------------------------------------- |
| `:type`   | `books` `certifications` `conferences` `course-seminars` `subscriptions` `other` |

##### Body

The request body is the object you wish to create. Please see documentation for PdsaItem models.

##### Response

| Status               | Code  | Response                                                                |
| -------------------- | ----- | ----------------------------------------------------------------------- |
| Created successfully | `201` | Server responds with the object created.                                |
| Invalid type         | `400` | Server responds with error message.                                     |
| Server error         | `500` | Server responds with the error message throw while creating the object. |

##### Examples

###### Creating a new PDSA item of type Other

```Javascript
POST http://cm-pdsa-server/pdsa/other

REQUEST.BODY:
{
    name: "A lesson in Restful APIs",
    primarySkillAreas: [
        "5d1b7d4dcbb67eb5487bf12a",
        "5d16532b8f741ead3ee636d2"
    ],
    secondarySkillAreas: [
        "5d1b85db03eda5c68e3b9718"
    ],
    url: "http://www.google.com",
    startingPdsaTier: 1,
    cost: {
        currency: "CAD",
        minCost: 1250,
        maxCost: 1250,
        groupPricingAvailable: false
    },
    institution: "x56jb85db03eda5c68e3b9718",
    program: "j45gb78bd03cwo5c68e3b0127",
    deliveryMethod: "online",
    location: "Calgary AB Canada",
    notableDates: {
        start: "2019-01-01",
        end: "2019-02-01",
        otherDates: ["1999-12-31"]

    },
    ongoing: true,
    visible: true
}
```

```Javascript
RESPONSE:
{
    "notableDates": {
        "otherDates": [
            "1999-12-31T00:00:00.000Z"
        ],
        "start": "2019-01-01T00:00:00.000Z",
        "end": "2019-02-01T00:00:00.000Z"
    },
    "_id": "5d2df59d26c371b9ed33a055",
    "primarySkillAreas": [
        "5d2cdd272fa1b9a44cd3d9a5",
        "5d2cebc6c240d7aa3edafded"
    ],
    "secondarySkillAreas": [
        "5d2df51e26c371b9ed33a054"
    ],
    "previousAttendees": [],
    "__t": "Other",
    "name": "A lesson in Restful APIs",
    "url": "http://www.google.com",
    "startingPdsaTier": 1,
    "cost": {
        "currency": "CAD",
        "minCost": 1250,
        "maxCost": 1250,
        "groupPricingAvailable": false
    },
    "institution": "5d28e2886778eb82b6ef13f1",
    "program": "5d0bbce9a4e95add5f4f82e2",
    "deliveryMethod": "online",
    "location": {
        "country": "Canada",
        "province": "Alberta",
        "city": "Calgary"
    },
    "ongoing": true,
    "visible": true,
    "primarySkillAreaSortKey": "Leadership and Development",
    "secondarySkillAreaSortKey": "Leadership",
    "reviews": [],
    "__v": 0
}
```

#### Read

##### Description

These routes are used to query the database for PDSA Items. It allows for basic searching, filtering and sorting. You can also query all of the PDSA Items all at once, or drill down into the specific types by changing the type parameter.Types can be one of the following `books`, `certifications`, `conferences`, `course-seminars`, `subscriptions`, `other` or `pdsa-items`. You can specify a singular Pdsa Item to return via the id parameter; id must be a valid `ObjectId` for the pdsa item being updated. You can also paginate results using the `limit` and `page` options in your query. As well as sort on `name`, `primarySkillArea` and `secondarySkillArea` by supplying a comma separated list of field and order (e.g. sort=name:asc,primary:desc)

##### URLS

`HTTP GET http://cm-pdsa-server/pdsa/:type` => Returns all pdsa objects of specified type.

`HTTP GET http://cm-pdsa-server/pdsa/:type/:id` => Returns the pdsa object matching specified type and id.

`HTTP GET http://cm-pdsa-server/pdsa/:type?:query` => Returns all pdsa objects of specified type matching all parameters and values specified in the query.

##### URL Parameters

| Parameter | Possible values                                                                  |
| --------- | -------------------------------------------------------------------------------- |
| `:type`   | `books` `certifications` `conferences` `course-seminars` `subscriptions` `other` |

##### Query Parameters

Query Paramters go after the **?** and are separated with **&**. E.g. `http://cm-pdsa-server/pdsa/pdsa-items?primarySkillAreas=5d2cdd272fa1b9a44cd3d9a5,5d2cebc6c240d7aa3edafded&visible=true&startDate=2019-01-01&endDate=2020-01-01&sort=name:asc,primary:desc&limit=1&page=1`

| Parameter                                  | Description                                                                                                                                                                                                                                                         | Example                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `primarySkillAreas`                        | A comma separated list of primarySkillArea ids.                                                                                                                                                                                                                     | primarySkillAreas=5d2cdd272fa1b9a44cd3d9a5, 5d24ea012ffce00d3d1148e3 |
| `secondarySkillAreas`                      | A comma separated list of secondarySkillArea ids.                                                                                                                                                                                                                   | secondarySkillAreas=5d2df51e26c371b9ed33a054                         |
| `search`                                   | Searches (pseudo fuzzy) _name_, and the names of: _primarySkillAreas_ and _secondarySkillAreas_. **Note:** only searches the skill areas if you are not filtering by them as well.                                                                                  | search=Leadership and Development                                    |
| `minCost` `maxCost` `filterIncludeMaxCost` | Filter to costs between minCost and maxCost. Defaults to only comparing the items minCost t the filters, can use flag to include maxCost in comparison.                                                                                                             | minCost=12.4&maxCost=14.5&filterIncludeMaxCost=true                  |
| `currency`                                 | Filter by exact match on currency (case insensitive)                                                                                                                                                                                                                | currency=CAD                                                         |
| `groupPricingAvailable`                    | Filter whether `true` or `false`                                                                                                                                                                                                                                    | groupPricingAvailable=true                                           |
| `type`                                     | Allows you to filter by type, so that you can grab items matching multiple types. Types are provided in a comma separated list. Works best if `:type` is set to `pdsa-items`.                                                                                       | type=books,course-seminars                                           |
| `location`                                 | Filters to match locations provided. **Note:** location should be a comma separated list of locations with no commas in the location itself. E.g. `location=Calgary AB, Chicago USA` is OK `location=Calgary, AB, Canada, Chicago, USA` is not OK (we split on `,`) | location=Chicago USA, Calgary AB Canada, Toronto ON Canada           |
| `deliveryMethod`                           | Filters exact match on deliveryMethod.                                                                                                                                                                                                                              | deliveryMethod=in-class                                              |
| `startingPdsaTier`                         | Filters exact match on startingPdsaTier                                                                                                                                                                                                                             | startingPdsaTier=3                                                   |
| `visible`                                  | Filters on visible or invisible                                                                                                                                                                                                                                     | visible=true                                                         |
| `institution`                              | Filters on exact match to one ObjectId reference to institution                                                                                                                                                                                                     | institution=5d28e2886778eb82b6ef13f1                                 |
| `program`                                  | Filters on exact match to one ObjectId reference to program                                                                                                                                                                                                         | program=5d0bbce9a4e95add5f4f82e2                                     |
| `startDate`, `endDate`                     | Filter to all dates inbetween startDate and endDate                                                                                                                                                                                                                 | startDate=2019-01-01&endDate=2020-01-01                              |
| `limit`, `page`                            | Used for pagination. Limit to a certain number of entries per page and specify page you want.                                                                                                                                                                       | limit=1&page=2                                                       |
| `sort`                                     | Used for sorting data by either name, primary or secondary skills in either ascending (`asc`) or descending (`desc`) order.                                                                                                                                         | sort=name:desc,primary:desc                                          |

##### Body

No request body should be supplied.

##### Response

| Status                                | Code  | Response                                                                                                                                                                                                                              |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Updated successfully                  | `200` | Server responds with the object requested when specified by `id`. Otherwise an object containing `docs` which is an array of all objects (Mongo documents) matching the request and `totalDocs` which is the count of docs in `docs`. |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                                                                                   |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                                                                                               |

##### Body

No request body should be supplied.

##### Response

| Status                                | Code  | Response                                                                                                                                                                                                                              |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Updated successfully                  | `200` | Server responds with the object requested when specified by `id`. Otherwise an object containing `docs` which is an array of all objects (Mongo documents) matching the request and `totalDocs` which is the count of docs in `docs`. |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                                                                                   |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                                                                                               |

##### Examples

###### Get all PDSA Items in database

```Javascript
GET 'http://cm-pdsa-server/pdsa/pdsa-items'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "location": {
                "country": "Canada",
                "province": "Alberta",
                "city": "Calgary"
            },
            "notableDates": {
                "otherDates": [
                    "1999-12-31T00:00:00.000Z"
                ],
                "start": "2019-01-01T00:00:00.000Z",
                "end": "2019-02-01T00:00:00.000Z"
            },
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Other",
            "reviews": [],
            "_id": "5d2e34af26c371b9ed33a05c",
            "name": "Numero 4",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 1250,
                "maxCost": 1250,
                "groupPricingAvailable": false
            },
            "institution": {
                "_id": "5d28e2886778eb82b6ef13f1",
                "name": "University of Calgary",
                "__v": 0
            },
            "program": {
                "_id": "5d0bbce9a4e95add5f4f82e2",
                "name": "Computer Science",
                "institution": "5d28e2886778eb82b6ef13f1",
                "__v": 0
            },
            "deliveryMethod": "online",
            "ongoing": true,
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "__v": 0
        },
        {
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Book",
            "reviews": [],
            "_id": "5d2e34da26c371b9ed33a05d",
            "name": "The Story of  Book",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 1250,
                "maxCost": 1250,
                "groupPricingAvailable": false
            },
            "author": "John Doe",
            "publisher": "Penguin House",
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "__v": 0
        },
        {
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Book",
            "reviews": [],
            "_id": "5d2e34e726c371b9ed33a05e",
            "name": "The Story of a Book 2",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 1250,
                "maxCost": 1250,
                "groupPricingAvailable": false
            },
            "author": "John Doe",
            "publisher": "Penguin House",
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "__v": 0
        },
        {
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Book",
            "reviews": [],
            "_id": "5d2e34fd26c371b9ed33a05f",
            "name": "Story of a Book 3",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 12.5,
                "maxCost": 12.5,
                "groupPricingAvailable": false
            },
            "author": "John Doe",
            "publisher": "Penguin House",
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "__v": 0
        }
    ],
    "totalDocs": 4
}
```

###### Get all PDSA Items specific item by id

```Javascript
GET 'http://cm-pdsa-server/pdsa/pdsa-items/5d2e34fd26c371b9ed33a05f'
```

```Javascript
RESPONSE:
{
    "primarySkillAreas": [
        "5d2cdd272fa1b9a44cd3d9a5",
        "5d2cebc6c240d7aa3edafded"
    ],
    "secondarySkillAreas": [
        "5d2df51e26c371b9ed33a054"
    ],
    "previousAttendees": [],
    "__t": "Book",
    "reviews": [],
    "_id": "5d2e34fd26c371b9ed33a05f",
    "name": "Story of a Book 3",
    "url": "http://www.google.com",
    "startingPdsaTier": 1,
    "cost": {
        "currency": "CAD",
        "minCost": 12.5,
        "maxCost": 12.5,
        "groupPricingAvailable": false
    },
    "author": "John Doe",
    "publisher": "Penguin House",
    "visible": true,
    "primarySkillAreaSortKey": "Seals March Together",
    "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
    "__v": 0
}
```

###### Get all PDSA Items of type book

```Javascript
GET 'http://cm-pdsa-server/pdsa/books'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Book",
            "_id": "5d2e34da26c371b9ed33a05d",
            "name": "The Story of  Book",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 1250,
                "maxCost": 1250,
                "groupPricingAvailable": false
            },
            "author": "John Doe",
            "publisher": "Penguin House",
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "reviews": [],
            "__v": 0
        },
        {
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Book",
            "_id": "5d2e34e726c371b9ed33a05e",
            "name": "The Story of a Book 2",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 1250,
                "maxCost": 1250,
                "groupPricingAvailable": false
            },
            "author": "John Doe",
            "publisher": "Penguin House",
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "reviews": [],
            "__v": 0
        },
        {
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Book",
            "_id": "5d2e34fd26c371b9ed33a05f",
            "name": "Story of a Book 3",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 12.5,
                "maxCost": 12.5,
                "groupPricingAvailable": false
            },
            "author": "John Doe",
            "publisher": "Penguin House",
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "reviews": [],
            "__v": 0
        }
    ],
    "totalDocs": 3
}
```

###### Search PDSA items for name or skill names matching 'Numero'

```Javascript
GET 'http://cm-pdsa-server/pdsa/pdsa-items?search=Numero'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "location": {
                "country": "Canada",
                "province": "Alberta",
                "city": "Calgary"
            },
            "notableDates": {
                "otherDates": [
                    "1999-12-31T00:00:00.000Z"
                ],
                "start": "2019-01-01T00:00:00.000Z",
                "end": "2019-02-01T00:00:00.000Z"
            },
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Other",
            "reviews": [],
            "_id": "5d2e34af26c371b9ed33a05c",
            "name": "Numero 4",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 1250,
                "maxCost": 1250,
                "groupPricingAvailable": false
            },
            "institution": {
                "_id": "5d28e2886778eb82b6ef13f1",
                "name": "University of Calgary",
                "__v": 0
            },
            "program": {
                "_id": "5d0bbce9a4e95add5f4f82e2",
                "name": "Computer Science",
                "institution": "5d28e2886778eb82b6ef13f1",
                "__v": 0
            },
            "deliveryMethod": "online",
            "ongoing": true,
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "__v": 0
        }
    ],
    "totalDocs": 1
}
```

###### Search PDSA items for name or skill names matching 'UnusedString'

```Javascript
GET 'http://cm-pdsa-server/pdsa/pdsa-items?search=UnusedString'
```

```Javascript
RESPONSE:
{
    "docs": [],
    "totalDocs": 0
}
```

###### Combining filters in query

```Javascript
GET 'http://cm-pdsa-server/pdsa/pdsa-items?primarySkillAreas=5d2cdd272fa1b9a44cd3d9a5,5d2cebc6c240d7aa3edafded&visible=true&startDate=2019-01-01&endDate=2020-01-01'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "location": {
                "country": "Canada",
                "province": "Alberta",
                "city": "Calgary"
            },
            "notableDates": {
                "otherDates": [
                    "1999-12-31T00:00:00.000Z"
                ],
                "start": "2019-01-01T00:00:00.000Z",
                "end": "2019-02-01T00:00:00.000Z"
            },
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Other",
            "reviews": [],
            "_id": "5d2e34af26c371b9ed33a05c",
            "name": "Numero 4",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 1250,
                "maxCost": 1250,
                "groupPricingAvailable": false
            },
            "institution": {
                "_id": "5d28e2886778eb82b6ef13f1",
                "name": "University of Calgary",
                "__v": 0
            },
            "program": {
                "_id": "5d0bbce9a4e95add5f4f82e2",
                "name": "Computer Science",
                "institution": "5d28e2886778eb82b6ef13f1",
                "__v": 0
            },
            "deliveryMethod": "online",
            "ongoing": true,
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "__v": 0
        }
    ],
    "totalDocs": 1
}
```

###### Get all PDSA items sorting on name in ascending order

```Javascript
GET 'http://cm-pdsa-server/pdsa/pdsa-items?sort=name:asc'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "location": {
                "country": "Canada",
                "province": "Alberta",
                "city": "Calgary"
            },
            "notableDates": {
                "otherDates": [
                    "1999-12-31T00:00:00.000Z"
                ],
                "start": "2019-01-01T00:00:00.000Z",
                "end": "2019-02-01T00:00:00.000Z"
            },
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Other",
            "reviews": [],
            "_id": "5d2e34af26c371b9ed33a05c",
            "name": "Numero 4",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 1250,
                "maxCost": 1250,
                "groupPricingAvailable": false
            },
            "institution": {
                "_id": "5d28e2886778eb82b6ef13f1",
                "name": "University of Calgary",
                "__v": 0
            },
            "program": {
                "_id": "5d0bbce9a4e95add5f4f82e2",
                "name": "Computer Science",
                "institution": "5d28e2886778eb82b6ef13f1",
                "__v": 0
            },
            "deliveryMethod": "online",
            "ongoing": true,
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "__v": 0
        },
        {
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Book",
            "reviews": [],
            "_id": "5d2e34fd26c371b9ed33a05f",
            "name": "Story of a Book 3",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 12.5,
                "maxCost": 12.5,
                "groupPricingAvailable": false
            },
            "author": "John Doe",
            "publisher": "Penguin House",
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "__v": 0
        },
        {
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Book",
            "reviews": [],
            "_id": "5d2e34da26c371b9ed33a05d",
            "name": "The Story of  Book",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 1250,
                "maxCost": 1250,
                "groupPricingAvailable": false
            },
            "author": "John Doe",
            "publisher": "Penguin House",
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "__v": 0
        },
        {
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Book",
            "reviews": [],
            "_id": "5d2e34e726c371b9ed33a05e",
            "name": "The Story of a Book 2",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 1250,
                "maxCost": 1250,
                "groupPricingAvailable": false
            },
            "author": "John Doe",
            "publisher": "Penguin House",
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "__v": 0
        }
    ],
    "totalDocs": 4
}
```

###### Get all PDSA items sorting on name in ascending order and paginating 1 item per page

```Javascript
GET 'http://localhost:3000/pdsa/pdsa-items?sort=name:asc&limit=1&page=1'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "location": {
                "country": "Canada",
                "province": "Alberta",
                "city": "Calgary"
            },
            "notableDates": {
                "otherDates": [
                    "1999-12-31T00:00:00.000Z"
                ],
                "start": "2019-01-01T00:00:00.000Z",
                "end": "2019-02-01T00:00:00.000Z"
            },
            "primarySkillAreas": [
                {
                    "_id": "5d2cdd272fa1b9a44cd3d9a5",
                    "name": "Seals March Together",
                    "__v": 0
                },
                {
                    "_id": "5d2cebc6c240d7aa3edafded",
                    "name": "Cows Against Seals",
                    "__v": 0
                }
            ],
            "secondarySkillAreas": [
                {
                    "_id": "5d2df51e26c371b9ed33a054",
                    "name": "Ka Ka PIIIIIIGD",
                    "parentPrimarySkillArea": "5d2cdd272fa1b9a44cd3d9a5",
                    "__v": 0
                }
            ],
            "previousAttendees": [],
            "__t": "Other",
            "reviews": [],
            "_id": "5d2e34af26c371b9ed33a05c",
            "name": "Numero 4",
            "url": "http://www.google.com",
            "startingPdsaTier": 1,
            "cost": {
                "currency": "CAD",
                "minCost": 1250,
                "maxCost": 1250,
                "groupPricingAvailable": false
            },
            "institution": {
                "_id": "5d28e2886778eb82b6ef13f1",
                "name": "University of Calgary",
                "__v": 0
            },
            "program": {
                "_id": "5d0bbce9a4e95add5f4f82e2",
                "name": "Computer Science",
                "institution": "5d28e2886778eb82b6ef13f1",
                "__v": 0
            },
            "deliveryMethod": "online",
            "ongoing": true,
            "visible": true,
            "primarySkillAreaSortKey": "Seals March Together",
            "secondarySkillAreaSortKey": "Ka Ka PIIIIIIGD",
            "__v": 0
        }
    ],
    "totalDocs": 4,
    "limit": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "page": 1,
    "totalPages": 4,
    "pagingCounter": 1,
    "prevPage": null,
    "nextPage": 2
}
```

#### Update

##### Description

This route is used to update an existing pdsa item, specified by the type and id parameter in the URL. Types can be one of the following `books`, `certifications`, `conferences`, `course-seminars`, `subscriptions` or `other`, and id must be a valid `ObjectId` for the pdsa item being updated.

**Note:** you _can_ also use `pdsa-items` as the generic type when updating.

##### URLS

`HTTP PATCH http://cm-pdsa-server/pdsa/:type/:id`
`HTTP PUT http://cm-pdsa-server/pdsa/:type/:id`

Use `PATCH` when updating some fields but not all. Use `PUT` when updating the entire object.

**NOTE:** `PUT` replaces the entire object, patch is for minor changes.

##### Parameters

| Parameter | Possible values                                                                               |
| --------- | --------------------------------------------------------------------------------------------- |
| `:type`   | `books` `certifications` `conferences` `course-seminars` `subscriptions` `other` `pdsa-items` |
| `:id`     | Valid `ObjectId` for the pdsa item to update                                                  |

##### Body

The request body is a JSON object containing the fields you wish to update and their new values. Please see documentation for pdsa models, for possible fields to update.

##### Response

| Status                                | Code  | Response                                                                                                                                                             |
| ------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Updated successfully                  | `200` | Server responds an object containing number of objects matching the id: `n`, number of objects updated: `nModified`, if the request was completed successfully: `ok` |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                  |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                              |

##### Examples

###### Updating a PDSA item with type Other with a new name

```Javascript
PATCH 'http://cm-pdsa-server/pdsa/other/5d2df59d26c371b9ed33a055'
or
PATCH 'http://cm-pdsa-server/pdsa/pdsa-items/5d2df59d26c371b9ed33a055'


REQUEST.BODY:
{
    name: "A lesson in AJAX"
}
```

```Javascript
RESPONSE:
{
    "n": 1,
    "nModified": 1,
    "ok": 1
}
```

###### Trying to update a PDSA Item without changing any values

```Javascript
PATCH 'http://cm-pdsa-server/pdsa/other/5d2df59d26c371b9ed33a055'


REQUEST.BODY:
{
    name: "A lesson in AJAX"
}
```

```Javascript
RESPONSE:
{
    "n": 1,
    "nModified": 0,
    "ok": 1
}
```

#### Delete

##### Description

This route is used to delete an existing pdsa item, specified by the type and id parameter in the URL. Types can be one of the following `books`, `certifications`, `conferences`, `course-seminars`, `subscriptions` or `other`, and id must be a valid `ObjectId` for the pdsa item being updated.

**Please Note:**

- you _can_ also use `pdsa-items` as the generic type when deleting.
- The object will be completely deleted and cannot be recovered.

##### URLS

`HTTP DELETE http://cm-pdsa-server/pdsa/:type/:id`

##### Parameters

| Parameter | Possible values                                                                               |
| --------- | --------------------------------------------------------------------------------------------- |
| `:type`   | `books` `certifications` `conferences` `course-seminars` `subscriptions` `other` `pdsa-items` |
| `:id`     | Valid `ObjectId` for the pdsa item to update                                                  |

##### Body

No request body should be supplied.

##### Response

| Status                                | Code  | Response                                                                                                                                                                        |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deleted successfully                  | `200` | Server responds with an object containing `n`: the number of objects matching the id, `ok`: if the query executed ok, `deletedCount`: how many items matching _id_ were deleted |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                             |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                                         |

##### Examples

###### Deleting a PDSA Item

```Javascript
DELETE 'http://cm-pdsa-server/pdsa/other/5d2df59d26c371b9ed33a055'
or
DELETE 'http://cm-pdsa-server/pdsa/pdsa-items/5d2df59d26c371b9ed33a055'
```

```Javascript
RESPONSE:
{
    "n": 1,
    "ok": 1,
    "deletedCount": 1
}
```

#### Batch Delete

##### Description

This route is used to delete multiple existing pdsa item. Specified by a list of ids passed in the body.

**Please Note:**

- you _can_ also use `pdsa-items` as the generic type when deleting.
- The objects will be completely deleted and cannot be recovered.

##### URL

`HTTP POST http://cm-pdsa-server/pdsa/:type/batch-delete`

##### Parameters

| Parameter | Possible values                                                                               |
| --------- | --------------------------------------------------------------------------------------------- |
| `:type`   | `books` `certifications` `conferences` `course-seminars` `subscriptions` `other` `pdsa-items` |

##### Body

The request body is a JSON object containing a field 'ids' which is an array of ids for the objects you want to detele.

##### Response

| Status                                | Code  | Response                                                                                                                                                                        |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deleted successfully                  | `200` | Server responds with an object containing `n`: the number of objects matching the id, `ok`: if the query executed ok, `deletedCount`: how many items matching _id_ were deleted |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                             |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                                         |

##### Examples

###### Deleting multiple PDSA Items

```Javascript
POST 'http://cm-pdsa-server/pdsa/pdsa-items/batch-delete'

REQUEST.BODY:
{
    "ids": [
        "5d2e06ff26c371b9ed33a056",
        "5d2e070926c371b9ed33a057",
        "5d2e078f26c371b9ed33a058",
        "5d2e079f26c371b9ed33a059",
        "5d2e07ae26c371b9ed33a05a"
    ]
}
```

```Javascript
RESPONSE:
{
    "n": 5,
    "ok": 1,
    "deletedCount": 5
}
```

#### Batch Update

##### Description

This route is used to update multiple existing pdsa item. Specified by a list of ids passed in the body. Mainly intended to be used to switch the visible flag on multiple objects at once.

**Please Note:**

- you _can_ also use `pdsa-items` as the generic type when deleting.

##### URL

`HTTP POST http://cm-pdsa-server/pdsa/:type/batch-update`

##### Parameters

| Parameter | Possible values                                                                               |
| --------- | --------------------------------------------------------------------------------------------- |
| `:type`   | `books` `certifications` `conferences` `course-seminars` `subscriptions` `other` `pdsa-items` |

##### Body

The request body is a JSON object containing a field 'ids' which is an array of ids for the objects you want to delete, and another field 'updates' which contains the updates you wish to perform for each object listed in ids.

##### Response

| Status                                | Code  | Response                                                                                                                                                             |
| ------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Updated successfully                  | `200` | Server responds an object containing number of objects matching the id: `n`, number of objects updated: `nModified`, if the request was completed successfully: `ok` |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                  |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                              |

##### Examples

###### Updating multiple PDSA Items

```Javascript
POST 'http://cm-pdsa-server/pdsa/pdsa-items/batch-update'

REQUEST.BODY:
{
    "ids": [
        "5d1cdba46b1773f69004c8c9",
        "5d24ea012ffce00d3d1148e3"
    ],
    "updates" : { "visible": false }
}
```

```Javascript
RESPONSE:
{
    "n": 2,
    "nModified": 2,
    "ok": 1
}
```
