# Workspace Davet Sistemi

Bu proje, bir çalışma alanı (workspace) uygulaması için geliştirilmiş
**ekip davet etme ve rol atama** sistemini içerir.

Amaç; bir workspace’e yeni kullanıcıları kolayca davet edebilmek,
bu kullanıcılara uygun yetkileri verebilmek ve tüm süreci
kullanıcı için **basit, anlaşılır ve akıcı** hale getirmektir.

---

## Projede Neler Yapılabiliyor?

Kullanıcılar;

- Workspace’lerine yeni kişileri **e-posta ile davet edebilir**
- Davet edilen kişiye **Üye (Member)** veya **Yönetici (Admin)** rolü atayabilir
- Davet işlemini modern ve tek ekranlı bir modal üzerinden gerçekleştirebilir
- Aynı arayüzü hem **aydınlık modda hem karanlık modda** sorunsuz şekilde kullanabilir

Tüm davet süreci tek bir akışta, sayfa değiştirmeden tamamlanır.

---

## Tasarım ve Kullanıcı Deneyimi

Bu projede sadece işlevsellik değil, **kullanıcı deneyimi** de ön planda tutulmuştur.

- Modal tasarımı geniş ve ferah olacak şekilde hazırlanmıştır
- Yazılar büyük ve okunabilir tutulmuştur
- Hover ve geçiş efektleri yumuşak şekilde uygulanmıştır
- Karanlık modda göz yormayan renkler tercih edilmiştir

Tasarım yaklaşımı olarak ClickUp ve Linear benzeri modern ürünlerden ilham alınmıştır.

---

## Teknik Genel Bakış

Frontend tarafında React kullanılmıştır.  
Bileşenler sade ve okunabilir olacak şekilde ayrılmıştır.

Backend tarafında FastAPI yer alır.  
Davet gönderme işlemi bir API endpoint’i üzerinden gerçekleştirilir ve
workspace ile rol bilgileri backend tarafından yönetilir.

---

## Davet Süreci Nasıl İşler?

1. Kullanıcı “Takıma Davet Et” butonuna tıklar  
2. Davet modalı açılır  
3. E-posta adresi girilir  
4. Kullanıcı için rol seçilir  
5. Davet gönderilir  

Bu işlemler sırasında kullanıcı sayfa değiştirmez ve süreç kesintiye uğramaz.

---

## Karanlık Mod Desteği

Proje, Tailwind CSS dark mode yapısını kullanır.

Uygulama karanlık moda alındığında:
- Arayüz otomatik olarak koyu renklere geçer
- Metinler ve ikonlar kontrastlı şekilde güncellenir
- Aynı bileşen light ve dark modda uyumlu çalışır

---

## Projeyi Çalıştırma

Frontend ve backend ayrı olarak çalışır.

Backend varsayılan olarak aşağıdaki adreste çalışır:
https://localhost:8000
---

## Geliştirici

**Devrim Margi**  
Software Engineering öğrencisi  
Modern arayüzler ve full-stack projeler geliştirmeye odaklanmaktadır.

---

## Gelecek Geliştirmeler

Bu yapı ileride;

- Davet linki ile kayıt olma
- Bildirim (toast) sistemi
- Davet edilen kullanıcıların listelenmesi
- Çoklu dil desteği

gibi özelliklerle genişletilebilir.