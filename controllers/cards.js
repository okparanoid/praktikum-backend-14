const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards.length) {
        res.status(200).send({ data: [] });
        return;
      }
      res.send(cards);
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new Error('NoRights');
      }
      card.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      } else if (err.message === 'NoRights') {
        res.status(403).send({ message: 'Нет прав' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(() => new Error('NotFound'))
    .then(() => res.send({ message: 'лайк' }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(() => new Error('NotFound'))
    .then(() => res.send({ message: 'дизлайк' }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
