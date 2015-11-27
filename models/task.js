'use strict';
module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Task", {
    taskId: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    }
    authorId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
    classMethods: {
      associate: function(models) {
        Task.belongsTo(models.User, {
          foreignKey: 'userId'
        });
      }
    }
  });
  return Task;
};
