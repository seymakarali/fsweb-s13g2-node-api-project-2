const express = require('express');
const router = express.Router();
const Posts = require('./posts-model');

router.get('/', (req, res) => {
  Posts.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(500).json({ message: 'Gönderiler alınamadı' }));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then(post => {
      if (!post) {
        res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      } else {
        res.json(post);
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Gönderi bilgisi alınamadı' });
    });
});

router.post('/', (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    return res.status(400).json({ message: 'Lütfen gönderi için bir title ve contents sağlayın' });
  }

  Posts.insert({ title, contents })
    .then(({ id }) => Posts.findById(id))
    .then(post => res.status(201).json(post))
    .catch(err => res.status(500).json({ message: 'Veritabanına kaydedilirken bir hata oluştu' }));
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (!title || !contents) {
    return res.status(400).json({ message: 'Lütfen gönderi için title ve contents sağlayın' });
  }

  Posts.findById(id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      }
      return Posts.update(id, { title, contents })
        .then(() => Posts.findById(id))
        .then(updated => res.json(updated));
    })
    .catch(err => res.status(500).json({ message: 'Gönderi bilgileri güncellenemedi' }));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Belirtilen ID li gönderi bulunamadı' });
      }
      return Posts.remove(id)
        .then(() => res.json(post));
    })
    .catch(err => res.status(500).json({ message: 'Gönderi silinemedi' }));
});

router.get('/:id/comments', (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
      }
      return Posts.findPostComments(id)
        .then(comments => res.json(comments));
    })
    .catch(err => res.status(500).json({ message: 'Yorumlar bilgisi getirilemedi' }));
});

module.exports = router;