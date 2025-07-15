class MakeCategoryIdNotNullOnObjectives < ActiveRecord::Migration[7.2]
  def up
    # 1) On s’assure d’avoir une catégorie “Générique”
    default_cat = Category.find_or_create_by!(
      name: "Générique",
      icon: "?",
      color: "#CCCCCC"
    )

    # 2) On back-fill tous les objectifs orphelins
    Objective.where(category_id: nil).update_all(category_id: default_cat.id)

    # 3) On rend finally category_id non-nullable
    change_column_null :objectives, :category_id, false
  end

  def down
    change_column_null :objectives, :category_id, true
  end
end
