import PrimarySkillArea from '../../database/models/metadata/primarySkillArea';
import PdsaItem from '../../database/models/pdsaItem';
import SecondarySkillArea from '../../database/models/metadata/secondarySkillArea';

/**
 * Given the primarySkillAreaId, find its name and update the sort key for the give pdsaItem.
 *
 * @param {ObjectId} primarySkillAreaId
 * @param {ObjectId} pdsaItemId
 */
const updatePrimarySkillAreaSortKey = async (primarySkillAreaId, pdsaItemId) => {
  try {
    const newSortKey = (await PrimarySkillArea.findById(primarySkillAreaId)).name;
    await PdsaItem.update({ _id: pdsaItemId }, { primarySkillAreaSortKey: newSortKey });
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Given the secondarySkillAreaId, find its name and update the sort key for the give pdsaItem.
 *
 * @param {*} secondarySkillAreaId
 * @param {*} itemId
 */
const updateSecondarySkillAreaSortKey = async (secondarySkillAreaId, itemId) => {
  try {
    const newSortKey = (await SecondarySkillArea.findById(secondarySkillAreaId)).name;
    await PdsaItem.update({ _id: itemId }, { secondarySkillAreaSortKey: newSortKey });
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Remove all references to the secondarySkillAreaId we are deleting, from the arrays in PDSAItems. Then update all PdsaItems that still have SecondarySkills but their SecondarySkillAreaSortKey is empty to use the first SecondarySkillArea they have.
 * @param {ObjectId} secondarySkillAreaId
 */
export const cleanUpSecondarySkillAreaSortKeys = async secondarySkillAreaId => {
  // and remove the id reference from the array
  await PdsaItem.updateMany(
    {
      secondarySkillAreas: secondarySkillAreaId
    },
    {
      $pullAll: {
        secondarySkillAreas: [secondarySkillAreaId]
      }
    }
  );

  // find all items that have no sort key but still contain elements in the skillArea array
  const itemsThatNeedToBeUpdatedAgain = await PdsaItem.find({
    secondarySkillAreaSortKey: '',
    $where: 'this.secondarySkillAreas.length > 0'
  });

  for (let i = 0; i < itemsThatNeedToBeUpdatedAgain.length; i += 1) {
    updateSecondarySkillAreaSortKey(
      itemsThatNeedToBeUpdatedAgain[i].secondarySkillAreas[0],
      itemsThatNeedToBeUpdatedAgain[i]._id
    );
  }
  console.log(`Items to be updated again:  ${JSON.stringify(itemsThatNeedToBeUpdatedAgain)}`);
};

/**
 * Remove all references to the primarySkillAreaId we are deleting, from the arrays in PDSAItems. Then update all PdsaItems that still have PrimarySkills but their PrimarySkillAreaSortKey is empty to use the first PrimarySkillArea they have.
 * @param {ObjectId} secondarySkillAreaId
 */
export const cleanUpPrimarySkillAreaSortKeys = async primarySkillAreaId => {
  // and remove the id reference from the array
  await PdsaItem.updateMany(
    {
      primarySkillAreas: primarySkillAreaId
    },
    {
      $pullAll: {
        primarySkillAreas: [primarySkillAreaId]
      }
    }
  );

  // find all items that have no sort key but still contain elements in the skillArea array
  const itemsThatNeedToBeUpdatedAgain = await PdsaItem.find({
    primarySkillAreaSortKey: '',
    $where: 'this.primarySkillAreas.length > 0'
  });

  for (let i = 0; i < itemsThatNeedToBeUpdatedAgain.length; i += 1) {
    updatePrimarySkillAreaSortKey(
      itemsThatNeedToBeUpdatedAgain[i].primarySkillAreas[0],
      itemsThatNeedToBeUpdatedAgain[i]._id
    );
  }
  console.log(`Items to be updated again:  ${JSON.stringify(itemsThatNeedToBeUpdatedAgain)}`);
};
