document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.cursor');
  const container = document.querySelector('.container');
  
  // Add cursor follow effect
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
  });
  
  // Hide cursor when mouse leaves container
  container.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  
  container.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
  
  // Add touch support for mobile
  container.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
  }, { passive: false });
});