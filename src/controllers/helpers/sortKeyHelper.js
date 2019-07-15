import PrimarySkillArea from '../../database/models/metadata/primarySkillArea';
import PdsaItem from '../../database/models/pdsaItem';
import SecondarySkillArea from '../../database/models/metadata/secondarySkillArea';

const updatePrimarySkillAreaSortKey = async (primarySkillAreaId, itemId) => {
  try {
    const newSortKey = (await PrimarySkillArea.findById(primarySkillAreaId)).name;
    await PdsaItem.update({ _id: itemId }, { primarySkillAreaSortKey: newSortKey });
  } catch (e) {
    throw new Error(e);
  }
};

const updateSecondarySkillAreaSortKey = async (secondarySkillAreaId, itemId) => {
  try {
    const newSortKey = (await SecondarySkillArea.findById(secondarySkillAreaId)).name;
    await PdsaItem.update({ _id: itemId }, { secondarySkillAreaSortKey: newSortKey });
  } catch (e) {
    throw new Error(e);
  }
};

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
