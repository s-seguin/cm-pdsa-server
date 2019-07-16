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

1. `npm i` to install all dependencies.
2. `npm start` to start server using `nodemon`.

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

This model is used to store the different Secondary Skill Areas. Each Secondary Skill belongs to a `PrimarySkillArea` and has a reference to its parent.

##### Fields

| Name                   | Description                                                                          | Type       | Required             |
| ---------------------- | ------------------------------------------------------------------------------------ | ---------- | -------------------- |
| name                   | The name of the SecondarySkillArea                                                   | `String`   | `true`               |
| parentPrimarySkillArea | An ObjectId that references the PrimarySkillArea this SecondarySkillArea belongs to. | `ObjectId` | `true`               |
| _\_id_                 | Auto generated ObjectId                                                              | `ObjectId` | _Created by MongoDb_ |

##### Example

To create a new `SecondarySkillArea` supply an object like:

```JSON
{
    name: "Teamwork",
    parentPrimarySkillArea: "5d1cdba46b1773f69004c8c9"
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
| **location**              | **The location the certification is from or being offered.**                                                             | **{ country: `String`, province: `String`, city:`String` }**                                   | **`false`**          |
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
    location: {
        country: "Canada",
        province: "Alberta",
        city: "Calgary"
    }
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
| **location**              | **The location the conference is from or being offered.**                                                                | **{ country: `String`, province: `String`, city:`String` }**                                   | **`false`**          |
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
    location: {
        country: "Canada",
        province: "Alberta",
        city: "Calgary"
    }
    notableDates: {
        start: "2019-01-01",
        end: "2019-02-01",
        otherDates: ["1999-12-31"]

    }
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
| **location**              | **The location the course seminar is from or being offered.**                                                            | **{ country: `String`, province: `String`, city:`String` }**                                   | **`false`**          |
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
    location: {
        country: "Canada",
        province: "Alberta",
        city: "Calgary"
    }
    notableDates: {
        start: "2019-01-01",
        end: "2019-02-01",
        otherDates: ["1999-12-31"]

    }
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
| **location**              | **The location the item is from or being offered.**                                                                      | **{ country: `String`, province: `String`, city:`String` }**                                   | **`false`**          |
| **notableDates**          | **An object containing the start and end date of the item, and any other notable dates.**                                | **{ start: `Date`, end: `Date`, otherDates:[`Date`] }**                                        | **`false`**          |
| **ongoing**               | **Denotes whether or not the item is currently being offered and ongoing.**                                              | **`Boolean`**                                                                                  | **`false`**          |
| visible                   | Denotes whether item is visible or invisible to employees.                                                               | `Boolean`                                                                                      | `true`               |
| _\_id_                    | Auto generated ObjectId                                                                                                  | `ObjectId`                                                                                     | _Created by MongoDb_ |

##### Example

To create a new `Other` supply an object like:

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
        minCost: 1250,
        maxCost: 1250,
        groupPricingAvailable: false
    },
    institution: "x56jb85db03eda5c68e3b9718",
    program: "j45gb78bd03cwo5c68e3b0127",
    deliveryMethod: "online",
    location: {
        country: "Canada",
        province: "Alberta",
        city: "Calgary"
    }
    notableDates: {
        start: "2019-01-01",
        end: "2019-02-01",
        otherDates: ["1999-12-31"]

    }
    ongoing: true,
    visible: true
}
```

_Please note:_ Supplied other example only used mandatory fields.

## Endpoints

---

### Metadata

---

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
    parentPrimarySkillArea: "5d27b965360bcc6761543637"
}
```

```Javascript
RESPONSE:
{
    "_id": "5d27b993360bcc6761543638",
    "name": "Teamwork",
    "parentPrimarySkillArea": "5d27b965360bcc6761543637",
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
| Updated successfully                  | `200` | Server responds with the object requested when specified by `id`. Otherwise an object containing `docs` which is an array of all objects (Mongo documents) matching the request and `totalDocs` which is the count of docs in `docs`. |
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
GET 'http://cm-pdsa-server/metadata/secondary-skills/parent-id/5d27b965360bcc6761543637'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "_id": "5d28e5b66778eb82b6ef13f4",
            "name": "Teamwork",
            "parentPrimarySkillArea": {
                "_id": "5d27b965360bcc6761543637",
                "name": "Learning and Development",
                "__v": 0
            },
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
DELETE 'http://cm-pdsa-server/metadata/primary-skills/5d27b965360bcc6761543637'
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

#### Read

#### Update

#### Delete

#### Batch Delete

#### Batch Update
