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

### Metadata

#### PrimarySkillArea

##### Description

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

##### Description

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

## Endpoints

### Metadata

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

#### Update

#### Delete

### PDSA

#### Create

#### Read

#### Update

#### Delete

#### Batch Delete

#### Batch Update
